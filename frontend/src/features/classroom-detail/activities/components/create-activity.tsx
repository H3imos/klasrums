import * as Mantine from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useRef, useState, type SubmitEvent } from "react";

import type { CreateActivityFormPayload } from "../types";

type CreateActivityProps = {
  opened: boolean;
  periodName: string;
  mode?: "create" | "edit";
  initialValues?: CreateActivityFormPayload;
  onClose: () => void;
  onSave?: (payload: CreateActivityFormPayload) => Promise<void> | void;
  isSaving?: boolean;
  errorMessage?: string;
};

export default function CreateActivity({
  opened,
  periodName,
  mode = "create",
  initialValues,
  onClose,
  onSave,
  isSaving = false,
  errorMessage,
}: CreateActivityProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [weightPercent, setWeightPercent] = useState<number | "">(
    initialValues?.weightPercent ?? "",
  );
  const [limitDate, setLimitDate] = useState<Date | string | null>(
    initialValues?.limitDate ?? null,
  );
  const [localError, setLocalError] = useState<string | null>(null);

  const resetForm = () => {
    formRef.current?.reset();
    setName("");
    setWeightPercent("");
    setLimitDate(null);
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

    const payload: CreateActivityFormPayload = {
      name: name.trim(),
      weightPercent: typeof weightPercent === "number" ? weightPercent : -1,
      limitDate: limitDate ? dayjs(limitDate).format("YYYY-MM-DD") : "",
    };

    if (!payload.name || payload.weightPercent < 0 || !payload.limitDate) {
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
      title={mode === "edit" ? "Editar actividad" : "Crear actividad"}
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
            label="Periodo"
            value={periodName}
            readOnly
            data-testid="activities-activity-period-input"
          />

          <Mantine.TextInput
            name="name"
            label="Nombre de la actividad"
            placeholder="Ej. Quiz de fracciones"
            withAsterisk
            required
            data-testid="activities-activity-name-input"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <Mantine.NumberInput
            name="weightPercent"
            label="Ponderación (%)"
            placeholder="Ej. 25"
            min={0}
            max={100}
            clampBehavior="strict"
            suffix="%"
            step={1}
            withAsterisk
            required
            data-testid="activities-activity-weight-input"
            value={weightPercent}
            onChange={(value) => {
              if (typeof value === "number") {
                setWeightPercent(value);
                return;
              }

              setWeightPercent("");
            }}
          />

          <DateInput
            name="limitDate"
            label="Fecha limite"
            placeholder="Selecciona una fecha"
            withAsterisk
            required
            data-testid="activities-activity-limit-input"
            value={limitDate}
            onChange={(value) => {
              setLimitDate(value);
            }}
          />

          <Mantine.Group justify="flex-end" mt="sm">
            <Mantine.Button
              type="button"
              variant="default"
              onClick={handleClose}
              data-testid="activities-activity-cancel-button"
              disabled={isSaving}
            >
              Cancelar
            </Mantine.Button>
            <Mantine.Button
              type="submit"
              data-testid="activities-activity-save-button"
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
