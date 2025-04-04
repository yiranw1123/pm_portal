"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { LayoutDashboard, FolderKanban, ListTodo, Users, Settings, ChevronRight, ChevronDown, Plus, Search, Users2, Map, Layers, Calendar, Folders, FolderGit2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const DASHBOARD_ITEMS = [
  { id: 1, title: "Product Discovery", icon: Search },
  { id: 2, title: "Customer Discovery", icon: Users2 },
  { id: 3, title: "User Journey Mapping", icon: Map },
  { id: 4, title: "Tech Stack Canvas", icon: Layers },
  { id: 5, title: "Dev Schedule", icon: Calendar },
]

type ProjectSection = {
  id: number
  completed: boolean
  data?: any // This can be structured based on each section's needs
}

type Project = {
  id: number
  name: string
  description: string
  sections: ProjectSection[]  // Instead of just completedSections number
}

const TOTAL_SECTIONS = 5 // Based on your DASHBOARD_ITEMS length

const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "Building a modern e-commerce solution",
    sections: DASHBOARD_ITEMS.map(item => ({
      id: item.id,
      completed: false
    }))
  },
  {
    id: 2,
    name: "Mobile App",
    description: "Customer loyalty program app",
    sections: DASHBOARD_ITEMS.map(item => ({
      id: item.id,
      completed: false
    }))
  },
]

type NewProjectForm = {
  name: string
  description: string
}

// First, let's add a type for navigation views
type NavigationView = 'projects' | 'dashboard' | 'tasks' | 'team' | 'settings'

export default function Home() {
  // Update state management
  const [currentView, setCurrentView] = useState<NavigationView>('projects')
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true)
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [newProject, setNewProject] = useState<NewProjectForm>({
    name: '',
    description: ''
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    setProjects(savedProjects ? JSON.parse(savedProjects) : SAMPLE_PROJECTS)
    setIsLoading(false)
  }, [])

  // Update localStorage whenever projects change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('projects', JSON.stringify(projects))
    }
  }, [projects, isLoading])

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
    setCurrentView('dashboard')
  }

  const handleItemClick = (id: number) => {
    setSelectedItem(id)
    setCurrentView('dashboard')
  }

  const handleCreateProject = () => {
    const project: Project = {
      id: projects.length + 1,
      name: newProject.name,
      description: newProject.description,
      sections: DASHBOARD_ITEMS.map(item => ({
        id: item.id,
        completed: false
      }))
    }
    
    setProjects(prevProjects => [...prevProjects, project])
    setNewProject({ name: '', description: '' })
    setIsNewProjectOpen(false)
  }

  const handleDeleteProject = (projectId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click when clicking delete
    setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId))
    if (currentProject?.id === projectId) {
      setCurrentProject(null)
      setCurrentView('projects')
    }
  }

  // Sidebar rendering
  const renderSidebar = () => (
    <div className="w-64 border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        {/* Project Selection Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                {currentProject ? (
                  <FolderGit2 className="h-4 w-4 shrink-0" />
                ) : (
                  <Folders className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">
                  {currentProject ? currentProject.name : "All Projects"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--trigger-width]">
            <DropdownMenuItem
              className="gap-2"
              onClick={() => {
                setCurrentProject(null)
                setCurrentView('projects')
              }}
            >
              <Folders className="h-4 w-4" />
              All Projects
            </DropdownMenuItem>
            <Separator className="my-1" />
            {projects.map(project => (
              <DropdownMenuItem
                key={project.id}
                className="gap-2"
                onClick={() => handleProjectSelect(project)}
              >
                <FolderGit2 className="h-4 w-4" />
                <span className="truncate">{project.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Project-specific navigation */}
        {currentProject && (
          <>
            <Button 
              variant={currentView === 'dashboard' ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => {
                setCurrentView('dashboard')
                setSelectedItem(null)
                setIsDashboardExpanded(!isDashboardExpanded)
              }}
            >
              <LayoutDashboard className="h-4 w-4" />
              Project Dashboard
            </Button>

            {/* Dashboard sections */}
            {isDashboardExpanded && currentView === 'dashboard' && (
              <div className="pl-4 flex flex-col gap-1">
                {DASHBOARD_ITEMS.map((item) => {
                  const IconComponent = item.icon
                  const isCompleted = currentProject.sections.find(
                    s => s.id === item.id
                  )?.completed
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`justify-start gap-2 text-sm hover:bg-secondary transition-colors
                        ${selectedItem === item.id ? "bg-secondary" : ""}
                        ${isCompleted ? "text-green-600" : ""}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.title}
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Project-specific features */}
            <Button 
              variant={currentView === 'tasks' ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setCurrentView('tasks')}
            >
              <ListTodo className="h-4 w-4" />
              Project Tasks
            </Button>

            <Button 
              variant={currentView === 'team' ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => setCurrentView('team')}
            >
              <Users className="h-4 w-4" />
              Project Team
            </Button>
          </>
        )}

        <Separator className="my-2" />

        {/* Global navigation */}
        <Button 
          variant={currentView === 'settings' ? "secondary" : "ghost"}
          className="justify-start gap-2"
          onClick={() => setCurrentView('settings')}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      {/* Main Content */}
      <div className="flex-1">
        {currentView === 'projects' ? (
          // Projects View
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Projects</h1>
              <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Add a new project and start building!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input 
                        id="name" 
                        value={newProject.name}
                        onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description" 
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject} disabled={!newProject.name || !newProject.description}>
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow 
                      key={project.id} 
                      className="cursor-pointer" 
                      onClick={() => handleProjectSelect(project)}
                    >
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(project.sections.filter(s => s.completed).length / TOTAL_SECTIONS) * 100} 
                            className="w-[60%]"
                          />
                          <span className="text-sm text-muted-foreground">
                            {project.sections.filter(s => s.completed).length}/{TOTAL_SECTIONS} sections
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={(e) => handleDeleteProject(project.id, e)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ) : currentView === 'dashboard' ? (
          <div className="w-full h-full bg-white p-8">
            {currentProject && (
              <div className="mb-6">
                <h1 className="text-2xl font-semibold">{currentProject.name}</h1>
                <p className="text-muted-foreground">{currentProject.description}</p>
              </div>
            )}
            {selectedItem ? (
              // Selected Dashboard Item View
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {DASHBOARD_ITEMS.find(item => item.id === selectedItem)?.title}
                </h2>
                {/* Section-specific content */}
              </div>
            ) : (
              // Dashboard Carousel View
              <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
                <Card className="w-[1200px]">
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      <div className="relative px-20">
                        <Carousel>
                          <CarouselContent className="-ml-8">
                            {DASHBOARD_ITEMS.map((item) => (
                              <CarouselItem key={item.id} className="basis-1/3 pl-8">
                                <div 
                                  className="flex h-64 w-full items-center justify-center rounded-xl border-2 border-gray-200 text-2xl font-semibold shadow-sm hover:border-gray-300 hover:shadow-md transition-all cursor-pointer px-6"
                                  onClick={() => handleItemClick(item.id)}
                                >
                                  <span className="text-center">{item.title}</span>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2" />
                          <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2" />
                        </Carousel>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}