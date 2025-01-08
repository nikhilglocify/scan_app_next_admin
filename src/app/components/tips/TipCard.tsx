import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

type TipCardProps = {
  image: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
};

const TipCard: React.FC<TipCardProps> = ({ image, description, onEdit, onDelete }) => {
  return (
    <Card className="relative">
      {/* Kebab Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Card Image */}
      <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-md">
        <img src={image} alt="Card Image" className="w-full h-full object-cover" />
      </div>

      {/* Card Description */}
      <CardContent>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default TipCard;
