import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { TipModel } from "@/app/models/Tip";
import { generateClientS3Url } from "@/app/helpers/utils";
import { useEffect, useState } from "react";
import { getBlob } from "@/app/appApi/Tip";
import Image from "next/image";

type TipCardProps = {
  tip: TipModel;
  onEdit: (tip: TipModel, imagePreview: string) => void;
  onDelete: (id:string) => void;
};

const TipCard: React.FC<TipCardProps> = ({ tip, onEdit, onDelete }) => {
  const [blobURL, setBlobURL] = useState("");

  const fetchBlob = async () => {
    try {
      const response = await fetch(`/api/blob?key=${tip.image}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setBlobURL(url);
    } catch (error) {
      console.error("Error fetching blob:", error);
    }
  };

  useEffect(() => {
    // fetchBlob();
    if (tip.image) {
      const url = generateClientS3Url(tip.image);
      setBlobURL(url);
    }else{
      setBlobURL("https://img.freepik.com/free-vector/quick-helpful-tips-advice-yellow-background-vector-illustration_1017-40994.jpg")
    }
  }, []);
  return (
    <Card className="relative h-[100%]" style={{}}>
      {/* Kebab Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(tip, blobURL)}>
            Edit
          </DropdownMenuItem>
         {tip._id? <DropdownMenuItem onClick={()=>onDelete(tip._id!)} className="text-red-500">Delete</DropdownMenuItem>:""} 
         
        </DropdownMenuContent>
      </DropdownMenu>
      <h2 className="py-2 px-3">Date: {new Date(tip.date).toDateString()}</h2>
      {/* Card Image */}
      <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-md" style={{
    position: 'relative',
    paddingTop:"100%",
    
  }}>
        {blobURL ? (
          <img
            src={blobURL}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            id="myImg"
            alt="Card Image"
            className="w-[100%] h-[100%] object-contain"
          />
        ) : (
          <p className="text-center">Loading...</p>
        )}
       
      </div>

      {/* Card Description */}
      <CardContent>

        <p className="text-lg text-muted-foreground mt-4 break-words">{tip?.description}</p>
      </CardContent>
    </Card>
  );
};

export default TipCard;
