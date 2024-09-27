import type { Notification } from '@prisma/client';
import { useEffect, useState } from 'react';
import { BellIcon } from '@radix-ui/react-icons';
import { getNotificationsByUserId } from '@/data/user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { useUserContext } from '@/contexts/user';

export default function Notifications() {
  const { user }  = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        try {
          const fetchedNotifications = await getNotificationsByUserId(user.id);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Erreur lors de la récupération des notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [user?.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <BellIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-w-[300px]" align="end">
        <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex items-center">
  {notification.title}
</DropdownMenuItem>

            ))
          ) : (
            <DropdownMenuItem>Vous n&apos;avez pas de notifications.</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
