import * as Mantine from "@mantine/core";
import { useRef, type SubmitEvent } from "react";

type CreateClassroomPayload = {
  className: string;
  classroom: string;
};

type CreateClassroomProps = {
  opened: boolean;
  onClose: () => void;
  onSave?: (payload: CreateClassroomPayload) => void;
};

export default function CreateClassroom({
  opened,
  onClose,
  onSave,
}: CreateClassroomProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    formRef.current?.reset();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      className: String(formData.get("className") ?? "").trim(),
      classroom: String(formData.get("classroom") ?? "").trim(),
    };

    if (!payload.className || !payload.classroom) {
      return;
    }

    onSave?.(payload);
    handleClose();
  };

  return (
    <Mantine.Modal
      opened={opened}
      onClose={handleClose}
      title="Crear clase"
      size="lg"
      centered
      closeOnClickOutside={false}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <Mantine.Stack>
          <Mantine.TextInput
            name="className"
            label="Nombre de la clase"
            placeholder="Ej. Matemáticas 7A"
            withAsterisk
            required
          />

          <Mantine.TextInput
            name="classroom"
            label="Salón"
            placeholder="Ej. 101"
            withAsterisk
            required
          />

          <Mantine.Group justify="flex-end" mt="sm">
            <Mantine.Button
              type="button"
              variant="default"
              onClick={handleClose}
            >
              Cancelar
            </Mantine.Button>
            <Mantine.Button type="submit">Guardar</Mantine.Button>
          </Mantine.Group>
        </Mantine.Stack>
      </form>
    </Mantine.Modal>
  );
}
