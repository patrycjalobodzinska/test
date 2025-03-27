import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { FC } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

interface ProcurementItem {
  id: string;
  description: string;
  unit?: string;
  subItems?: ProcurementItem[];
}

interface SortableRowProps {
  item: ProcurementItem;
  isMain: boolean;
  addRow: (parentId: string) => void;
  removeRow: (id: string) => void;
  handleChange: (
    id: string,
    field: keyof ProcurementItem,
    value: string
  ) => void;
  updateData: (
    updateFn: (data: ProcurementItem[]) => ProcurementItem[]
  ) => void;
}

const SortableRow: FC<SortableRowProps> = ({
  item,
  addRow,
  isMain,
  removeRow,
  handleChange,
  updateData,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSubItemDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateData((prev) => {
      return prev.map((parent) => {
        if (parent.id === item.id && parent.subItems) {
          const oldIndex = parent.subItems.findIndex(
            (sub) => sub.id === active.id
          );
          const newIndex = parent.subItems.findIndex(
            (sub) => sub.id === over.id
          );
          return {
            ...parent,
            subItems: arrayMove(parent.subItems, oldIndex, newIndex),
          };
        }
        return parent;
      });
    });
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className="border-b bg-white">
        {isMain ? 
          <td className="border px-3 py-2" rowSpan={2}>
            <button {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="text-gray-500" />
            </button>
            {item.id}
          </td>
       :<td></td> }
        <td className="border px-3 py-2">
          {!isMain && item.id}{" "}
          <input
            value={item.description}
            onChange={(e) =>
              handleChange(item.id, "description", e.target.value)
            }
            className="w-full px-2 py-1 border rounded"
          />
        </td>
        <td className="border px-3 py-2">
          <input
            value={item.unit || ""}
            onChange={(e) => handleChange(item.id, "unit", e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </td>
        <td className="border px-3 py-2">
          {!item.id.includes(".") && (
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => addRow(item.id)}>
              Dodaj podpozycję
            </button>
          )}
          <button
            className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
            onClick={() => removeRow(item.id)}>
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
      {item.subItems && item.subItems.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleSubItemDragEnd}>
          <SortableContext
            items={item.subItems.map((sub) => sub.id)}
            strategy={verticalListSortingStrategy}>
            {item.subItems.map((sub) => (
              <SortableRow
                isMain={false}
                key={sub.id}
                item={sub}
                addRow={addRow}
                removeRow={removeRow}
                handleChange={handleChange}
                updateData={updateData}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </>
  );
};

export default SortableRow;
