import * as Mantine from "@mantine/core";
import { useRef, useState, type SubmitEvent } from "react";

import type { CreateStudentFormPayload } from "../types";

type CreateStudentProps = {
  opened: boolean;
  onClose: () => void;
  onSave?: (payload: CreateStudentFormPayload) => Promise<void> | void;
  isSaving?: boolean;
  errorMessage?: string;
};

export default function CreateStudent({
  opened,
  onClose,
  onSave,
  isSaving = false,
  errorMessage,
}: CreateStudentProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setFullName("");
    setEmail("");
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

    const payload: CreateStudentFormPayload = {
      fullName: fullName.trim(),
      email: email.trim(),
    };

    if (!payload.fullName || !payload.email) {
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
      title="Agregar estudiante"
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
            name="fullName"
            label="Nombre completo"
            placeholder="Ej. Ana Maria Gomez"
            withAsterisk
            required
            data-testid="students-fullname-input"
            value={fullName}
            onChange={(event) => setFullName(event.currentTarget.value)}
          />

          <Mantine.TextInput
            name="email"
            type="email"
            label="Correo"
            placeholder="Ej. ana.gomez@colegio.edu.co"
            withAsterisk
            required
            data-testid="students-email-input"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />

          <Mantine.Group justify="flex-end" mt="sm">
            <Mantine.Button
              type="button"
              variant="default"
              onClick={handleClose}
              data-testid="students-cancel-button"
              disabled={isSaving}
            >
              Cancelar
            </Mantine.Button>
            <Mantine.Button
              type="submit"
              data-testid="students-save-button"
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
