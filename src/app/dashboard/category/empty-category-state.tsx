import Card from '@/components/ui/card';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

interface EmptyCategoryState {
    categoryName : string;
}


const EmptyCategoryState = ({categoryName} : EmptyCategoryState) => {
  const router = useRouter()

  const {data} = useQuery({
    queryKey : ["cateogory",categoryName,"hasEvents"],
    queryFn : async () => {
        const res = await client.category.pollCategory.$get({
            name : categoryName,
        })

        return await res.json();
    },

    refetchInterval(query){
        return query.state.data?.hasEvents ? false : 1000;
    }
  })

  const hasEvents = data?.hasEvents


  useEffect(() => {
    if(hasEvents){
        router.refresh();
    }
  }, [router,hasEvents])
  
  
    return (
    <Card 
        contentClassName='max-w-2xl w-full flex flex-col items-center p-6'
        className='flex-1 flex items-center justify-center'
    >
        <h2 className='text-xl/8 font-medium text-center tracking-tight text-gray-950'>
            Create your first {categoryName} event
        </h2>
    </Card>
  )
}

export default EmptyCategoryState