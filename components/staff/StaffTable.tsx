"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Users, Mail, Calendar } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { StaffTableData } from "../../types/prismaTypes";
import { toast } from "sonner";

import { deleteStaffData, editStaffDetails,getAllStaff } from "@/app/action/staffOnboarding";


interface StaffTableEditData extends StaffTableData {
  password?: string;
}

import {
  Pagination,
  PaginationContent,
 // PaginationEllipsis,
  PaginationItem,
 // PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


export default function StaffTable({ propdata, totalPage }: { propdata: StaffTableData[], totalPage:number }) {
  const [staffData, setStaffData] = useState<StaffTableData[]>(propdata);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<StaffTableEditData | null>(
    null
  );
  const[currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(totalPage)
  
  useEffect(()=>{

    async function fetchStaffData(){
      try {

        const newData = await getAllStaff({page:currentPage,limit:5, search:""})

        if(newData.success){
          toast.success("data updated")
          setStaffData(newData.data || [])
          setTotalPages(newData.totalPage ||1)
        }
        else{
          toast.error("error could not get latest data",{
            description:`error: ${newData.message}`
          })
        }
        
      } catch (error) {
        console.error("error happened while fetching latest data", error)  
      }
    }

    fetchStaffData()

  },[currentPage])

  function handleEditStaff(staff: StaffTableData) {
    setEditingStaff(staff as StaffTableEditData);
    setIsEditDialogOpen(true);
  }

  async function handleUpdateStaff(editId: string) {
  console.log(editId, "userId of staff");
  console.log(editingStaff, "edit staff frontend data");

  // Guard clause to avoid undefined/null issues
  if (
    !editingStaff?.name ||
    !editingStaff?.user.email ||
    !editingStaff?.position ||
    !editingStaff?.status
  ) {
    toast.error("Please fill all required fields");
    return;
  }

  const editData = {
    name: editingStaff.name,
    email: editingStaff.user.email,
    position: editingStaff.position,
    password: editingStaff.password, 
    status: editingStaff.status,
  };

  try {
    const result = await editStaffDetails({
      staffId: editId,
      staffEditData: editData, // Now guaranteed to match StaffEdit type
    });

    if (!result.success) {
      toast.error(result.message);
      
    } else {
      toast.success("data updated successfully");
      setIsEditDialogOpen(false)
    }
  } catch (error) {
    console.error("Error updating staff:", error);
    toast.error("Unexpected error occurred");
  }
}
// todo fix the pagination when page is lesser than 7 all pages are being shown even if we have 2 pages.

function getVisiblePages(current: number, total: number): (number | "...")[] {
  // If total pages are few (<=7), show all
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();

  // Always show first and last page
  pages.add(1);
  pages.add(total);

  // Show current, and its neighbors (±1)
  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 1 && i < total) {
      pages.add(i);
    }
  }

  const result: (number | "...")[] = [];
  const sorted = [...pages].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = sorted[i - 1];

    // If there's a gap between this and previous page, add "..."
    if (prev && curr - prev > 1) {
      result.push("...");
    }

    result.push(curr);
  }

  return result;
}

const visiblePages = getVisiblePages(currentPage, totalPages);


  async function handleDelete(userId: string) {
    try {
      const result = await deleteStaffData(userId);

      if (result.success) {
        toast("deleted successfully");
      } else {
        toast("error while deleteing", {
          description: `error ${result.message}`,
        });
      }
    } catch (error) {
      console.error("error while deleting staff data", error);
      toast("error", {
        description: `error ${error}`,
      });
    }
  }

  return (
    <div className=" py-24">
      <Card className="border-orange-200 shadow-lg py-0">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 py-4 rounded-t-xl">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Users className="w-5 h-5 text-orange-600" />
            Current Staff Members
          </CardTitle>
          <CardDescription>
            Manage your team members and their details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-orange-100">
                <TableHead className="font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Join Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffData.map((staff) => (
                <TableRow
                  key={staff.id}
                  className="border-orange-100 hover:bg-orange-50/50"
                >
                  <TableCell className="font-medium text-gray-900">
                    {staff.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {staff.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                    >
                      {staff.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {staff.createdAt.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        staff.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className={
                        staff.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={()=>handleEditStaff(staff)}
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Staff Member</DialogTitle>
                            <DialogDescription>
                              Make changes to the staff member's information
                              here.
                            </DialogDescription>
                          </DialogHeader>
                          {editingStaff && (
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingStaff.name}
                                  onChange={(e) =>
                                    setEditingStaff({
                                      ...editingStaff,
                                      name: e.target.value,
                                    })
                                  }
                                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  value={editingStaff.user.email || ""}
                                  onChange={(e) =>
                                    setEditingStaff({
                                      ...editingStaff,
                                      user: {
                                        ...editingStaff.user,
                                        email: e.target.value,
                                      },
                                    })
                                  }
                                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <select
                                  id="edit-role"
                                  value={editingStaff.position}
                                  onChange={(e) =>
                                    setEditingStaff({
                                      ...editingStaff,
                                      position: e.target.value,
                                    })
                                  }
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                >
                                  <option value="Server">Server</option>
                                  <option value="Chef">Chef</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Cashier">Cashier</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                  id="edit-status"
                                  value={editingStaff.status}
                                  onChange={(e) =>
                                    setEditingStaff({
                                      ...editingStaff,
                                      status: e.target
                                        .value as StaffTableData["status"],
                                    })
                                  }
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-orange-500 focus:ring-orange-500 focus:outline-none"
                                >
                                  <option value="ACTIVE">Active</option>
                                  <option value="INACTIVE">Inactive</option>
                                  <option value="TERMINATED">Terminated</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-password">
                                  New Password (optional for reset)
                                </Label>
                                <Input
                                  id="edit-password"
                                  type="password" // Important for security and UI
                                  placeholder="Leave blank to keep current password"
                                  value={editingStaff.password || ""} // Ensure it's not undefined for controlled component
                                  onChange={(e) =>
                                    setEditingStaff({
                                      ...editingStaff,
                                      password: e.target.value,
                                    })
                                  }
                                  className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button
                              type="button"
                              onClick={()=>handleUpdateStaff(staff.userId)}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Staff Member
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {staff.name}? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(staff.userId)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  {totalPages > 1 && (
        <Pagination className="py-4 border-t-2">
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Page Buttons */}
            {visiblePages.map((p, index) =>
              p === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span className="px-2 text-gray-400">...</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`h-9 w-9 rounded-md text-sm flex items-center justify-center ${
                      currentPage === p
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                </PaginationItem>
              )
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

        </CardContent>
      </Card>
    </div>
  );
}
