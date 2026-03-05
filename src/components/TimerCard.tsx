import { useEffect, useState } from 'react';
import { Card, Text, Progress, Group, Title, Stack, Box } from '@mantine/core';
import type { Timer } from '../types';
import { calculateTimeRemaining, determineUrgency, calculateProgress, formatDateTimeUI } from '../utils/timeUtils';

interface TimerCardProps {
    timer: Timer;
    onClick: (timer: Timer) => void;
}

export function TimerCard({ timer, onClick }: TimerCardProps) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const status = calculateTimeRemaining(timer.targetDate, now);
    const urgency = determineUrgency(status);
    const progress = calculateProgress(timer.createdAt, timer.targetDate, now);
    const formattedDate = formatDateTimeUI(timer.targetDate);

    const urgencyColors: Record<string, string> = {
        far: 'teal',
        medium: 'blue',
        approaching: 'orange',
        imminent: 'red',
        past: 'gray'
    };

    const color = urgencyColors[urgency];

    return (
        <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            onClick={() => onClick(timer)}
            style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                borderColor: urgency === 'imminent' ? 'var(--mantine-color-red-filled)' : undefined,
                animation: urgency === 'imminent' ? 'pulse 2s infinite alternate' : 'none',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <Group justify="space-between" align="flex-start" mb="md">
                <Box style={{ flex: 1 }}>
                    <Title order={3} lineClamp={1}>{timer.title}</Title>
                    {timer.description && (
                        <Text c="dimmed" size="sm" lineClamp={2} mt={4}>
                            {timer.description}
                        </Text>
                    )}
                </Box>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">{formattedDate}</Text>
            </Group>

            <Group gap="md" mb="xl">
                {status.isPast ? (
                    <Stack gap={0}>
                        <Text size="3rem" fw={800} lh={1} c={color}>0</Text>
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase">Completed</Text>
                    </Stack>
                ) : (
                    <>
                        {status.days > 0 && (
                            <Stack gap={0}>
                                <Text size="3rem" fw={800} lh={1} c={color}>{status.days}</Text>
                                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Days</Text>
                            </Stack>
                        )}
                        <Stack gap={0}>
                            <Text size="3rem" fw={800} lh={1} c={color}>
                                {status.hours.toString().padStart(status.days === 0 ? 1 : 2, '0')}
                            </Text>
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Hrs</Text>
                        </Stack>
                        <Stack gap={0}>
                            <Text size="3rem" fw={800} lh={1} c={color}>
                                {status.minutes.toString().padStart(2, '0')}
                            </Text>
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase">Min</Text>
                        </Stack>
                        {status.days === 0 && (
                            <Stack gap={0}>
                                <Text size="3rem" fw={800} lh={1} c={color}>
                                    {status.seconds.toString().padStart(2, '0')}
                                </Text>
                                <Text size="xs" fw={700} c="dimmed" tt="uppercase">Sec</Text>
                            </Stack>
                        )}
                    </>
                )}
            </Group>

            <Progress value={progress} size="xs" color={color} mt="auto" />

            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(226, 85, 99, 0); }
                    100% { box-shadow: 0 0 20px rgba(226, 85, 99, 0.4); }
                }
            `}</style>
        </Card>
    );
}
