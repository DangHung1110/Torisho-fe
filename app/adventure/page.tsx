'use client';

import { Container, Title, Text, Button, TextInput, Box, Stack, Group, Paper, ActionIcon } from '@mantine/core';
import { IconSearch, IconBookmark, IconArrowDown, IconInfoCircle, IconMap } from '@tabler/icons-react';
import DashboardHeader from '../../src/components/DashboardHeader';
import { useState } from 'react';

const adventures = [
    {
        title: 'Isle of New Beginnings (PRE-N5)',
        image: 'https://images.unsplash.com/photo-1596395817730-811c7d2429a3?q=80&w=2000&auto=format&fit=crop', // Tropical-ish
        colorStart: '#20BAF9',
        colorEnd: '#1F85E8',
        info: 'Start your journey here!'
    },
    {
        title: 'Fledgling Forest (N5)',
        image: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2000&auto=format&fit=crop', // Forest
        colorStart: '#26C6DA',
        colorEnd: '#00ACC1',
        hasMap: true,
        info: 'Master the basics.'
    },
    {
        title: 'Depths of Devotion (N4)',
        image: 'https://images.unsplash.com/photo-1627916607164-7b6951910ef0?q=80&w=2000&auto=format&fit=crop', // Underwater/Jellyfish
        colorStart: '#4FC3F7',
        colorEnd: '#5E35B1',
        info: 'Learn deeper concepts.'
    },
    {
        title: 'Jungle of Tenacity (N3)',
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop', // Jungle
        colorStart: '#66BB6A',
        colorEnd: '#2E7D32',
        info: 'Things get wild here.'
    },
    {
        title: 'Sands of Mastery (N2)',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000&auto=format&fit=crop', // Desert
        colorStart: '#FFA726',
        colorEnd: '#3E2723',
        hasMap: true,
        info: 'The final frontier.'
    }
];

export default function AdventurePage() {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            <DashboardHeader />

            <Container size="lg" className="pt-10">
                
                {/* Dashboard Title */}
                <div className="text-center mb-8 flex flex-col items-center h-[350px] justify-around">
                    <Title className="text-gray-700 font-black text-3xl mb-6 tracking-tight">The Adventure Dashboard</Title>
                    
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative mb-4">
                        <TextInput 
                            placeholder="Search.."
                            radius="xl"
                            size="md"
                            rightSection={
                                <ActionIcon size="lg" radius="xl" variant="filled" color="blue" className="bg-blue-400 hover:bg-blue-500">
                                    <IconSearch size={18} />
                                </ActionIcon>
                            }
                            classNames={{
                                input: 'shadow-sm border-gray-200 pl-6'
                            }}
                        />
                    </div>

                    {/* Bookmarks Button */}
                    <div className="flex justify-center mb-8">
                        <Button 
                            leftSection={<IconBookmark size={16} />}
                            variant="light" 
                            color="gray"
                            radius="md"
                            className="bg-gray-200/50 hover:bg-gray-200 text-gray-600 font-bold"
                        >
                            My Bookmarks
                        </Button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <Text className="text-gray-400 font-bold text-sm cursor-pointer hover:text-gray-600 flex items-center gap-1">
                            Show Quick Filters <IconArrowDown size={14} />
                        </Text>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-center gap-3 mb-16">
                        <Button
                            leftSection={<IconArrowDown size={16} />}
                            radius="md"
                            size="md"
                            color="blue"
                            className="w-64 bg-blue-400 hover:bg-blue-500 font-bold shadow-sm shadow-blue-200"
                        >
                            Scroll to Current Tile
                        </Button>
                        <Button
                            leftSection={<div className="w-4 h-4 rounded-full border-2 border-white"></div>}
                            radius="md"
                            size="md"
                            color="green"
                            className="w-64 bg-green-400 hover:bg-green-500 font-bold shadow-sm shadow-green-200"
                        >
                            Open Current Tile Modal
                        </Button>
                    </div>
                </div>

                {/* Adventure Banners List */}
                <Stack gap="xl">
                    {adventures.map((adv, index) => (
                        <div 
                            key={index} 
                            className="relative h-28 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                        >
                            {/* Background Image & Overlay */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${adv.image})` }}
                            />
                            {/* Gradient Overlay */}
                            <div 
                                className="absolute inset-0 opacity-90"
                                style={{ background: `linear-gradient(to right, ${adv.colorStart}, ${adv.colorStart} 40%, transparent)` }}
                            />
                             {/* Alternative Gradient for variety if needed */}
                             <div 
                                className="absolute inset-0 opacity-80"
                                style={{ background: `linear-gradient(to right, ${adv.colorStart}, ${adv.colorEnd})`, opacity: 0.85 }} 
                            />

                            {/* Content */}
                            <div className="relative h-full flex items-center justify-between px-8 z-10">
                                <Title order={3} className="text-white font-black text-2xl tracking-wide shadow-black/10 drop-shadow-md">
                                    {adv.title}
                                </Title>

                                <Group>
                                    {adv.hasMap && (
                                        <Button 
                                            leftSection={<IconMap size={16} />}
                                            variant="filled" 
                                            color="grape" 
                                            radius="md"
                                            size="xs"
                                            className="font-bold bg-purple-500/90 hover:bg-purple-600 backdrop-blur-sm"
                                        >
                                            MAP
                                        </Button>
                                    )}
                                    <ActionIcon variant="transparent" className="text-white/70 hover:text-white">
                                        <IconInfoCircle size={28} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        </div>
                    ))}
                </Stack>

            </Container>
        </div>
    );
}
