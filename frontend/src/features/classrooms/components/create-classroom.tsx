import * as Mantine from "@mantine/core";
import { useRef, useState, type SubmitEvent } from "react";

import type { CreateClassroomFormPayload } from "../types";

type CreateClassroomProps = {
  opened: boolean;
  mode?: "create" | "edit";
  initialValues?: CreateClassroomFormPayload;
  onClose: () => void;
  onSave?: (payload: CreateClassroomFormPayload) => Promise<void> | void;
  isSaving?: boolean;
  errorMessage?: string;
};

export default function CreateClassroom({
  opened,
  mode = "create",
  initialValues,
  onClose,
  onSave,
  isSaving = false,
  errorMessage,
}: CreateClassroomProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
  };

  const handleClose = () => {
    if (isSaving) return;
    resetForm();
    setLocalError(null);
    onClose();
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    const formData = new FormData(event.currentTarget);
    const payload: CreateClassroomFormPayload = {
      className: String(formData.get("className") ?? "").trim(),
      classroom: String(formData.get("classroom") ?? "").trim(),
    };

    if (!payload.className || !payload.classroom) {
      return;
    }

    try {
      await onSave?.(payload);
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No fue posible guardar";
      setLocalError(message);
    }
  };

  return (
    <Mantine.Modal
      opened={opened}
      onClose={handleClose}
      title={mode === "edit" ? "Editar clase" : "Crear clase"}
      size="lg"
      centered
      closeOnClickOutside={false}
      closeOnEscape={!isSaving}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        <Mantine.Stack>
          {errorMessage || localError ? (
            <Mantine.Alert color="red" variant="light">
              {errorMessage ?? localError}
            </Mantine.Alert>
          ) : null}
          <Mantine.TextInput
            name="className"
            label="Nombre de la clase"
            placeholder="Ej. Matemáticas 7A"
            defaultValue={initialValues?.className ?? ""}
            withAsterisk
            required
            data-testid="classrooms-name-input"
          />

          <Mantine.TextInput
            name="classroom"
            label="Salón"
            placeholder="Ej. 101"
            defaultValue={initialValues?.classroom ?? ""}
            withAsterisk
            required
            data-testid="classrooms-room-input"
          />

          <Mantine.Group justify="flex-end" mt="sm">
            <Mantine.Button
              type="button"
              variant="default"
              onClick={handleClose}
              data-testid="classrooms-cancel-button"
              disabled={isSaving}
            >
              Cancelar
            </Mantine.Button>
            <Mantine.Button
              type="submit"
              data-testid="classrooms-save-button"
              loading={isSaving}
            >
              Guardar
            </Mantine.Button>
          </Mantine.Group>
        </Mantine.Stack>
      </form>
    </Mantine.Modal>
  );
}
