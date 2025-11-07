import { FC, ReactNode } from "react"
import { FolderOpen, ArrowUpRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: String
  actions?: ReactNode
  learnMoreLink?: {
    href: string
    label?: string
  }
}

export const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  learnMoreLink,
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon ?? <FolderOpen className="w-8 h-8 text-muted-foreground" />}
        </EmptyMedia>

        <EmptyTitle>{title}</EmptyTitle>

        {description && (
          <EmptyDescription>{description}</EmptyDescription>
        )}
      </EmptyHeader>

      {actions && <EmptyContent>{actions}</EmptyContent>}

      {learnMoreLink && (
        <Button
          variant="link"
          asChild
          className="text-muted-foreground"
          size="sm"
        >
          <a href={learnMoreLink.href} target="_blank" rel="noopener noreferrer">
            {learnMoreLink.label ?? "Saiba mais"} <ArrowUpRightIcon size={14} />
          </a>
        </Button>
      )}
    </Empty>
  )
}
