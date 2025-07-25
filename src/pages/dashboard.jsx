import { useState, useEffect, useMemo } from "react";
import { Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "../../src/assets/kinpluslogo.png";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://feedback-9ahh.onrender.com/response");
        const result = await res.json();
        console.log("Fetched from server:", result);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const departments = useMemo(() => {
    return [...new Set(data.map((item) => item.department))];
  }, [data]);

  const months = useMemo(() => {
    return [
      ...new Set(
        data.map((item) =>
          new Date(item.createdAt).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })
        )
      ),
    ].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || item.department === departmentFilter;

      const itemMonth = new Date(item.createdAt).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const matchesMonth = monthFilter === "all" || itemMonth === monthFilter;

      return matchesSearch && matchesDepartment && matchesMonth;
    });
  }, [searchTerm, departmentFilter, monthFilter, data]);

  const exportToExcel = () => {
    const formattedData = filteredData.map((item) => ({
      Name: item.fullName,
      Department: item.department,
      "Went Well": item.wentWell,
      "Didn't Go Well": item.didntGoWell,
      Challenges: item.challenges,
      Lessons: item.lessons,
      ShoutOuts: item.shoutOuts,
      "Start Doing": item.startDoing,
      "Stop Doing": item.stopDoing,
      "Continue Doing": item.continueDoing,
      "Follow Up": item.followUp,
      "Team Collab": item.ratings?.teamCollab || "-",
      "Cross Team": item.ratings?.crossTeamCollab || "-",
      "Work Life": item.ratings?.workLifeBalance || "-",
      Productivity: item.ratings?.productivity || "-",
      "Org Input": item.ratings?.orgInput || "-",
      Date: new Date(item.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, "feedback.xlsx");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <img style={{ width: "120px", height: "auto" }} src={logo} alt="KinPlus Logo" />
          <h1 className="text-3xl font-bold">Feedback Dashboard</h1>
           <h1 className="text-[15px] hidden md:block">www.kinplusgroup.com</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {data.length} responses
          </p>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </div>

        {/* Table with borders */}
        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table className="border border-gray-300">
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  <TableHead className="border border-gray-200 px-4 py-2">
                    Name
                  </TableHead>
                  <TableHead className="border border-gray-200 px-4 py-2">
                    Department
                  </TableHead>
                  <TableHead className="border border-gray-200 px-4 py-2">
                    Date
                  </TableHead>
                  <TableHead className="border border-gray-200 px-4 py-2">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item._id || index}
                      className="border-b border-gray-200"
                    >
                      <TableCell className="border border-gray-200 px-4 py-2">
                        {item.fullName}
                      </TableCell>
                      <TableCell className="border border-gray-200 px-4 py-2">
                        {item.department}
                      </TableCell>
                      <TableCell className="border border-gray-200 px-4 py-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="border border-gray-200 px-4 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDialogOpen(true);
                          }}
                        >
                          View More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for more details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Details for {selectedItem?.fullName}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Went Well:</strong> {selectedItem.wentWell}
              </p>
              <p>
                <strong>Didn't Go Well:</strong> {selectedItem.didntGoWell}
              </p>
              <p>
                <strong>Challenges:</strong> {selectedItem.challenges}
              </p>
              <p>
                <strong>Lessons:</strong> {selectedItem.lessons}
              </p>
              <p>
                <strong>ShoutOuts:</strong> {selectedItem.shoutOuts}
              </p>
              <p>
                <strong>Start Doing:</strong> {selectedItem.startDoing}
              </p>
              <p>
                <strong>Stop Doing:</strong> {selectedItem.stopDoing}
              </p>
              <p>
                <strong>Continue Doing:</strong> {selectedItem.continueDoing}
              </p>
              <p>
                <strong>Follow Up:</strong> {selectedItem.followUp}
              </p>
              <p>
                <strong>Team Collab:</strong>{" "}
                {selectedItem.ratings?.teamCollab || "-"}
              </p>
              <p>
                <strong>Cross Team:</strong>{" "}
                {selectedItem.ratings?.crossTeamCollab || "-"}
              </p>
              <p>
                <strong>Work Life:</strong>{" "}
                {selectedItem.ratings?.workLifeBalance || "-"}
              </p>
              <p>
                <strong>Productivity:</strong>{" "}
                {selectedItem.ratings?.productivity || "-"}
              </p>
              <p>
                <strong>Org Input:</strong>{" "}
                {selectedItem.ratings?.orgInput || "-"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
