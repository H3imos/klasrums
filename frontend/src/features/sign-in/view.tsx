import * as Mantine from "@mantine/core";
import * as Icons from "lucide-react";

export default function SignInView() {
  const renderComponent = () => {
    return (
      <Mantine.Center h="100%" bg="gray.0">
        <Mantine.Paper p="lg" shadow="md" withBorder>
          <Mantine.Title order={2}>Iniciar sesión</Mantine.Title>
          <Mantine.Text size="xs" c="dimmed" mb="md">
            Por favor, ingrese sus credenciales para iniciar sesión en su
            cuenta.
          </Mantine.Text>
          <Mantine.Stack>
            <Mantine.TextInput
              label="Correo electrónico"
              placeholder="Ingrese su correo electrónico"
              leftSection={<Icons.Mail size={16} />}
            />
            <Mantine.PasswordInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              leftSection={<Icons.Lock size={16} />}
            />
            <Mantine.Checkbox label="Recordar mi usuario" />
            <Mantine.Button>Iniciar sesión</Mantine.Button>
          </Mantine.Stack>
        </Mantine.Paper>
      </Mantine.Center>
    );
  };

  return renderComponent();
}
