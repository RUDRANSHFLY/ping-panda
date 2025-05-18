"use client"

import React from 'react'
import type {InferSelectModel} from "drizzle-orm"
import { eventCategories } from '@/server/db/schema';
import { useQuery } from '@tanstack/react-query';
import EmptyCategoryState from './empty-category-state';

interface CategoryPageContentProps{
    hasEvents : boolean;
    category :  InferSelectModel<typeof eventCategories>
}

const CategoryPageContent = ({category,hasEvents : initialHasEvents } : CategoryPageContentProps) => {

    const {data : pollingData} = useQuery({
        queryKey : ["category",category.name,"hasEvents"],
        initialData : {hasEvents : initialHasEvents}
        
    })

    if(!pollingData.hasEvents){
        return ( 
            <EmptyCategoryState 
                categoryName={category.name} 
            /> 
        )
    }
  return (
    <div>
      
    </div>
  )
}



export default CategoryPageContent
