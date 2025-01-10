import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { TipModel } from "@/app/models/tip";
import { generateClientS3Url } from "@/app/helpers/utils";
import { useEffect, useState } from "react";
import { getBlob } from "@/app/appApi/Tip";
import Image from "next/image";

type TipCardProps = {
  tip: TipModel;
  onEdit: (tip: TipModel, imagePreview: string) => void;
  onDelete: () => void;
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
    <Card className="relative h-[100%]">
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
          {/* <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <h2 className="py-2 px-3">Date: {new Date(tip.date).toDateString()}</h2>
      {/* Card Image */}
      <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-md">
        {blobURL ? (
          <img
            src={blobURL}
            id="myImg"
            alt="Card Image"
            className="w-[100%] h-[100%] object-contain"
          />
        ) : (
          <p className="text-center">Loading...</p>
        )}
        {/* <img src={generateClientS3Url("uploads/6780aabf05a66d06484b0704_copy-icon.png")|| "https://png.pngtree.com/png-vector/20220305/ourmid/pngtree-quick-tips-vector-ilustration-in-flat-style-png-image_4479926.png"} alt="Card Image" className="w-[100%] h-[100%] object-contain" /> */}
      </div>

      {/* Card Description */}
      <CardContent>
        {/* <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader> */}
        <p className="text-lg text-muted-foreground mt-4">{tip?.description}</p>
      </CardContent>
    </Card>
  );
};

export default TipCard;
