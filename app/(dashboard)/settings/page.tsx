'use client';

import { useUser } from '@/hooks/useUser';
import { useSignOut } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { data: user, isLoading } = useUser();
  const signOut = useSignOut();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">Account</p>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Signed in as {user?.email ?? '…'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {isLoading ? (
            <p className="text-muted-foreground">Loading profile…</p>
          ) : (
            <>
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name ?? '—'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email ?? '—'}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Sign out on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled={signOut.isPending} onClick={() => signOut.mutate()}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
