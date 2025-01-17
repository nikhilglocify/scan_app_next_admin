import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
  } from "@/components/ui/alert-dialog";
  
  interface DeleteConfirmationProps {
    title: string;
    description: string;
    onDelete: () => void;
    onCancel:()=>void,
    openAlert:boolean,
    setOpenAlert:any
  }
  
  export function DeleteConfirmation({
    title,
    description,
    onDelete,
    openAlert,
    setOpenAlert,
    onCancel
  }: DeleteConfirmationProps) {
    return (
      <AlertDialog open={openAlert}  onOpenChange={setOpenAlert}>
        {/* Trigger to open the dialog */}
        {/* <AlertDialogTrigger asChild >
          <button className="btn">Delete Item</button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  