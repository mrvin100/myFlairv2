import { CloudSnow, LucideIcon } from 'lucide-react'
import { FC, ReactNode } from 'react'

export type EmptyContentProps = {
   actionContent?: ReactNode
   text?: string
   icon?: LucideIcon
}

export const EmptyContent: FC<EmptyContentProps> = ({ actionContent, text, icon: Icon = CloudSnow }) => {
   return (
      <div className={'flex flex-col items-center gap-6 justify-center h-full py-10 px-5'}>
         <Icon className={'size-20 text-muted-foreground'} />
         <div className={'text-lg text-center text-muted-foreground'}>{text ?? 'Pas de contenu disponible !'}</div>
         {actionContent}
      </div>
   )
}
