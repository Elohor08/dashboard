"use client"

import { useState, useMemo } from "react"
import { Search, Filter, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for the dashboard
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Marketing",
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    department: "Sales",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    department: "HR",
    joinDate: "2023-04-05",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    department: "Engineering",
    joinDate: "2023-05-12",
  },
  {
    id: 6,
    name: "Lisa Davis",
    email: "lisa@example.com",
    department: "Marketing",
    joinDate: "2023-06-18",
  },
  {
    id: 7,
    name: "Tom Miller",
    email: "tom@example.com",
    department: "Sales",
    joinDate: "2023-07-22",
  },
  {
    id: 8,
    name: "Amy Garcia",
    email: "amy@example.com",
    department: "Engineering",
    joinDate: "2023-08-30",
  },
  { id: 9, name: "Chris Lee", email: "chris@example.com", department: "HR", joinDate: "2023-09-14" },
  {
    id: 10,
    name: "Emma Taylor",
    email: "emma@example.com",
    department: "Marketing",
    joinDate: "2023-10-08",
  },
  {
    id: 11,
    name: "Ryan Clark",
    email: "ryan@example.com",
    department: "Sales",
    joinDate: "2023-11-25",
  },
  {
    id: 12,
    name: "Nicole White",
    email: "nicole@example.com",
    department: "Engineering",
    joinDate: "2023-12-03",
  },
  {
    id: 13,
    name: "Kevin Martinez",
    email: "kevin@example.com",
    department: "HR",
    joinDate: "2024-01-17",
  },
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")

  // Get unique departments for the dropdown
  const departments = useMemo(() => {
    const uniqueDepartments = [...new Set(sampleData.map((item) => item.department))]
    return uniqueDepartments
  }, [])

  // Get unique months for the dropdown
  const months = useMemo(() => {
    const uniqueMonths = [
      ...new Set(
        sampleData.map((item) => {
          const date = new Date(item.joinDate)
          return date.toLocaleString("default", { month: "long", year: "numeric" })
        }),
      ),
    ]
    return uniqueMonths.sort()
  }, [])

  // Filter data based on search term and dropdown filters
  const filteredData = useMemo(() => {
    return sampleData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || item.department === departmentFilter

      const itemMonth = new Date(item.joinDate).toLocaleString("default", { month: "long", year: "numeric" })
      const matchesMonth = monthFilter === "all" || itemMonth === monthFilter

      return matchesSearch && matchesDepartment && matchesMonth
    })
  }, [searchTerm, departmentFilter, monthFilter])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Filter */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Department Dropdown Filter */}
              <div className="w-full md:w-48">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
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

              {/* Month Dropdown Filter */}
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

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {sampleData.length} employees
          </p>
          <Button variant="outline" size="sm">
            Export Data
          </Button>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No employees found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
