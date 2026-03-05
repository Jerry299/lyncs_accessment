import { useState } from 'react';
import { MantineProvider, Container, Title, Text, Button, Group, SimpleGrid, Center, Stack, ThemeIcon } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { IconClock, IconPlus } from '@tabler/icons-react';
import { useTimers } from './hooks/useTimers';
import { TimerCard } from './components/TimerCard';
import { TimerModal } from './components/TimerModal';
import type { Timer } from './types';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

function App() {
  const { timers, addTimer, editTimer, deleteTimer } = useTimers();
  const [modalOpened, setModalOpened] = useState(false);
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null);

  const handleOpenCreate = () => {
    setEditingTimer(null);
    setModalOpened(true);
  };

  const handleOpenEdit = (timer: Timer) => {
    setEditingTimer(timer);
    setModalOpened(true);
  };

  const handleSave = (timerData: Omit<Timer, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      editTimer(id, timerData);
    } else {
      addTimer(timerData);
    }
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <ModalsProvider>
        <Container size="lg" py="xl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Group justify="space-between" align="center" mb={50}>
            <div>
              <Title order={1} style={{
                background: 'linear-gradient(135deg, #fff, #aab2c8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Timelines</Title>
              <Text c="dimmed">Track what matters most to you.</Text>
            </div>
            <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
              New Event
            </Button>
          </Group>

          {timers.length === 0 ? (
            <Center style={{ flex: 1 }}>
              <Stack align="center" gap="sm">
                <ThemeIcon size={64} radius="xl" variant="light" color="gray">
                  <IconClock size={32} />
                </ThemeIcon>
                <Title order={3}>No Timelines yet</Title>
                <Text c="dimmed">Create your first countdown to see it track time beautifully.</Text>
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {timers.map((timer) => (
                <TimerCard key={timer.id} timer={timer} onClick={handleOpenEdit} />
              ))}
            </SimpleGrid>
          )}

          <TimerModal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            onSave={handleSave}
            onDelete={deleteTimer}
            editingTimer={editingTimer}
          />
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
