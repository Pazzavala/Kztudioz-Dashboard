'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { LuTrash } from 'react-icons/lu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';

interface DeleteProps {
    id: string;
    item: string;
}

export default function Delete({ id, item }: DeleteProps) {
    const [laoding, setLoading] = useState(false);
    const onDelete = async () => {
        try {
            setLoading(true);

            const itemType = item === 'product' ? 'products' : 'collections';

            const res = await fetch(`/api/${itemType}/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setLoading(false);
                // Refresh the page
                window.location.href = `/${itemType}`;
                toast.success(`${itemType} deleted`);
            }
        } catch (err) {
            console.log(err);
            toast.error('Something went wrong! Please try again.');
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button className='bg-red-1 text-white'>
                    <LuTrash size={20} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-white text-gray-500'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-red-1'>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your {item} and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onDelete}
                        className='bg-red-1 text-white'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
