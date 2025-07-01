"use client"

import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckIcon, ClipboardIcon } from 'lucide-react'
import React, { useState } from 'react'

interface ApiKeySettingsProps{
    apiKey : string
}

const ApiKeySettings = ({apiKey} : ApiKeySettingsProps) => {
 
    const [copySuccess, setCopySuccess] = useState<boolean>(false)
    
    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false),2000)
    }
 
    return (
    <Card className='max-w-xl w-full'>
    <div>
        <Label>
            Your API Key
        </Label>
        <div className='mt-1 relative'>
            <Input type={"password"} value={apiKey} readOnly />
            <div className='absolute space-x-0.5 inset-y-0 right-0 flex items-center'>
                <Button variant={"ghost"} onClick={copyApiKey} className='p-1 w-10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500'>
                    {copySuccess ? <CheckIcon className='size-4 text-shadow-fuchsia-900'/> : <ClipboardIcon  className='size-4 text-fuchsia-900' /> }
                </Button>
            </div>
        </div>
        <p className='mt-2 text-sm/6 text-gray-600'>
            Keep your key secret and do not share it with others
        </p>
    </div>
    </Card>
  )
}

export default ApiKeySettings
