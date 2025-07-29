import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import React from 'react'

const AccountCard = ({ account }) => {
    const { name, type, balance, id, isDefault } = account;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <Switch  />
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{parseFloat(balance).toFixed(2)}</div>
                <p className='text-xs text-muted-foreground'>{type.charAt(0) + type.slice(1).toLowerCase()}Account</p>
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    )
}

export default AccountCard
