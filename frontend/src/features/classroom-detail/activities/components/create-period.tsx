import * as Mantine from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useRef, useState, type SubmitEvent } from "react";

import type { CreatePeriodFormPayload } from "../types";

const formatDate = (value: Date | string | null): string =>
  value ? dayjs(value).format("YYYY-MM-DD") : "";

type CreatePeriodProps = {
  opened: boolean;
  onClose: () => void;
  onSave?: (payload: CreatePeriodFormPayload) => Promise<void> | void;
  isSaving?: boolean;
  errorMessage?: string;
};

export default function CreatePeriod({
  opened,
  onClose,
  onSave,
  isSaving = false,
  errorMessage,
}: CreatePeriodProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [dateStart, setDateStart] = useState<Date | string | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | string | null>(null);
  const [position, setPosition] = useState<number | "">("");
  const [localError, setLocalError] = useState<string | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setName("");
    setDateStart(null);
    setDateEnd(null);
    setPosition("");
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

    const payload: CreatePeriodFormPayload = {
      name: name.trim(),
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd),
      position: typeof position === "number" ? position : undefined,
    };

    if (!payload.name || !payload.dateStart || !payload.dateEnd) {
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
      title="Crear periodo"
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
            name="name"
            label="Nombre del periodo"
            placeholder="Ej. Periodo 1"
            withAsterisk
            required
            data-testid="activities-period-name-input"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <DateInput
            name="dateStart"
            label="Fecha de inicio"
            placeholder="Selecciona una fecha"
            withAsterisk
            required
            data-testid="activities-period-start-input"
            value={dateStart}
            onChange={(value) => {
              setDateStart(value);
            }}
          />

          <DateInput
            name="dateEnd"
            label="Fecha de fin"
            placeholder="Selecciona una fecha"
            withAsterisk
            required
            data-testid="activities-period-end-input"
            value={dateEnd}
            onChange={(value) => {
              setDateEnd(value);
            }}
          />

          <Mantine.NumberInput
            name="position"
            label="Posicion"
            placeholder="Ej. 1"
            min={1}
            data-testid="activities-period-position-input"
            value={position}
            onChange={(value) => {
              if (typeof value === "number") {
                setPosition(value);
                return;
              }

              setPosition("");
            }}
          />

          <Mantine.Group justify="flex-end" mt="sm">
            <Mantine.Button
              type="button"
              variant="default"
              onClick={handleClose}
              data-testid="activities-period-cancel-button"
              disabled={isSaving}
            >
              Cancelar
            </Mantine.Button>
            <Mantine.Button
              type="submit"
              data-testid="activities-period-save-button"
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
