import { useState, useEffect } from 'react';
import { Modal, TextInput, Textarea, Button, Group, Text, Popover, Stack } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import type { Timer } from '../types';

interface TimerModalProps {
    opened: boolean;
    onClose: () => void;
    onSave: (timer: Omit<Timer, 'id' | 'createdAt'>, id?: string) => void;
    onDelete?: (id: string) => void;
    editingTimer?: Timer | null;
}

export function TimerModal({ opened, onClose, onSave, onDelete, editingTimer }: TimerModalProps) {
    const form = useForm<{ title: string; targetDate: Date | null; description: string }>({
        initialValues: {
            title: '',
            targetDate: null,
            description: '',
        },
        validate: {
            title: (value) => (value.trim().length === 0 ? 'Title is required' : null),
            targetDate: (value) => (value === null ? 'Date is required' : null),
        },
    });

    const [popoverOpened, setPopoverOpened] = useState(false);
    const [tempDate, setTempDate] = useState<Date | null>(null);

    useEffect(() => {
        if (opened) {
            if (editingTimer) {
                form.setValues({
                    title: editingTimer.title,
                    targetDate: new Date(editingTimer.targetDate),
                    description: editingTimer.description || '',
                });
            } else {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setSeconds(0);
                tomorrow.setMilliseconds(0);

                form.setValues({
                    title: '',
                    targetDate: tomorrow,
                    description: '',
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened, editingTimer]);

    const handleSubmit = form.onSubmit((values) => {
        if (!values.targetDate) return;
        const targetDateIso = values.targetDate.toISOString();
        onSave({
            title: values.title,
            targetDate: targetDateIso,
            description: values.description
        }, editingTimer?.id);
        onClose();
        form.reset();
    });

    const handleClose = () => {
        onClose();
        form.reset();
    }

    return (
        <Modal opened={opened} onClose={handleClose} title={editingTimer ? "Edit Event" : "New Event"} centered>
            <form onSubmit={handleSubmit}>
                <TextInput
                    withAsterisk
                    label="Event Name"
                    placeholder="e.g. Project Launch"
                    {...form.getInputProps('title')}
                    mb="md"
                    data-autofocus
                />
                <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom-start" withArrow shadow="md">
                    <Popover.Target>
                        <TextInput
                            label="Date & Time"
                            withAsterisk
                            placeholder="Pick date and time"
                            readOnly
                            value={form.values.targetDate ? dayjs(form.values.targetDate).format('MMM D, YYYY h:mm A') : ''}
                            onClick={() => {
                                setTempDate(form.values.targetDate ? new Date(form.values.targetDate) : new Date());
                                setPopoverOpened(true);
                            }}
                            rightSection={<IconCalendar size={16} />}
                            mb="md"
                            styles={{ input: { cursor: 'pointer' } }}
                            error={form.errors.targetDate}
                        />
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Stack gap="sm">
                            <DatePicker
                                value={tempDate}
                                minDate={new Date()}
                                onChange={(d) => {
                                    const parsedDate = typeof d === 'string' ? new Date(d) : (d as Date | null);
                                    if (parsedDate && tempDate) {
                                        const newDate = new Date(parsedDate);
                                        newDate.setHours(tempDate.getHours(), tempDate.getMinutes());
                                        setTempDate(newDate);
                                    } else {
                                        setTempDate(parsedDate);
                                    }
                                }}
                            />
                            <TimeInput
                                label="Time"
                                value={tempDate ? `${tempDate.getHours().toString().padStart(2, '0')}:${tempDate.getMinutes().toString().padStart(2, '0')}` : ''}
                                onChange={(e) => {
                                    if (tempDate && e.target.value) {
                                        const [h, m] = e.target.value.split(':');
                                        const newDate = new Date(tempDate);
                                        newDate.setHours(parseInt(h, 10), parseInt(m, 10));
                                        setTempDate(newDate);
                                    }
                                }}
                            />
                            <Button fullWidth onClick={() => {
                                if (tempDate) {
                                    form.setFieldValue('targetDate', tempDate);
                                }
                                setPopoverOpened(false);
                            }}>
                                Confirm Date
                            </Button>
                        </Stack>
                    </Popover.Dropdown>
                </Popover>
                <Textarea
                    label="Description (Optional)"
                    placeholder="Brief details about the event..."
                    {...form.getInputProps('description')}
                    mb="xl"
                    rows={3}
                />
                <Group justify="space-between">
                    {editingTimer && onDelete ? (
                        <Button color="red" variant="light" onClick={() => {
                            modals.openConfirmModal({
                                title: 'Delete Event',
                                centered: true,
                                children: (
                                    <Text size="sm">
                                        Are you sure you want to delete this event? This action cannot be undone.
                                    </Text>
                                ),
                                labels: { confirm: 'Delete', cancel: "Cancel" },
                                confirmProps: { color: 'red' },
                                onConfirm: () => {
                                    onDelete(editingTimer.id);
                                    handleClose();
                                }
                            });
                        }}>
                            Delete
                        </Button>
                    ) : <div></div>}
                    <Group>
                        <Button variant="default" onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Save Event</Button>
                    </Group>
                </Group>
            </form>
        </Modal>
    );
}
