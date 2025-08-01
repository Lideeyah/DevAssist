import React, { useState } from "react";
import {
   Users,
   Plus,
   Settings,
   BarChart3,
   Code,
   GitBranch,
   Clock,
   Crown,
   Eye,
   Edit3,
   X,
} from "lucide-react";
import { User } from "../App";

interface TeamDashboardProps {
   user: User | null;
   onSwitchView: (view: "ide" | "team" | "sme") => void;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ onSwitchView }) => {
   const [activeTab, setActiveTab] = useState("overview");
   const [showInviteModal, setShowInviteModal] = useState(false);

   const teamMembers = [
      {
         id: "1",
         name: "John Doe",
         email: "john@example.com",
         role: "Admin",
         avatar: "👨🏽‍💻",
         status: "online",
         aiUsage: 45,
         commits: 23,
         lastActive: "2 minutes ago",
      },
      {
         id: "2",
         name: "Sarah Johnson",
         email: "sarah@example.com",
         role: "Developer",
         avatar: "👩🏾‍💻",
         status: "online",
         aiUsage: 32,
         commits: 18,
         lastActive: "5 minutes ago",
      },
      {
         id: "3",
         name: "Mike Chen",
         email: "mike@example.com",
         role: "Viewer",
         avatar: "👨🏻‍💻",
         status: "offline",
         aiUsage: 12,
         commits: 7,
         lastActive: "2 hours ago",
      },
   ];

   const projects = [
      {
         id: "1",
         name: "E-commerce Platform",
         description: "React + Node.js e-commerce solution",
         members: 3,
         commits: 156,
         lastUpdate: "2 hours ago",
         status: "active",
      },
      {
         id: "2",
         name: "Mobile App Backend",
         description: "REST API for mobile application",
         members: 2,
         commits: 89,
         lastUpdate: "1 day ago",
         status: "active",
      },
   ];

   const renderOverview = () => (
      <div className="space-y-6">
         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        Team Members
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {teamMembers.length}
                     </p>
                  </div>
                  <Users className="w-8 h-8 text-[#6C33FF]" />
               </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        Active Projects
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {projects.length}
                     </p>
                  </div>
                  <Code className="w-8 h-8 text-[#00A676]" />
               </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Commits
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        245
                     </p>
                  </div>
                  <GitBranch className="w-8 h-8 text-orange-500" />
               </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI Usage
                     </p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        89
                     </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
               </div>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
               Recent Activity
            </h3>
            <div className="space-y-4">
               {[
                  {
                     user: "John Doe",
                     action: "pushed 3 commits to main branch",
                     time: "2 minutes ago",
                     avatar: "👨🏽‍💻",
                  },
                  {
                     user: "Sarah Johnson",
                     action: "used AI to debug authentication issue",
                     time: "15 minutes ago",
                     avatar: "👩🏾‍💻",
                  },
                  {
                     user: "Mike Chen",
                     action: "joined the team",
                     time: "2 hours ago",
                     avatar: "👨🏻‍💻",
                  },
               ].map((activity, index) => (
                  <div
                     key={index}
                     className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-[#0D0D0D] rounded-lg"
                  >
                     <span className="text-2xl">{activity.avatar}</span>
                     <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                           <span className="font-medium">{activity.user}</span>{" "}
                           {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                           {activity.time}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );

   const renderMembers = () => (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
               Team Members
            </h3>
            <button
               onClick={() => setShowInviteModal(true)}
               className="flex items-center space-x-2 bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
               <Plus className="w-4 h-4" />
               <span>Invite Member</span>
            </button>
         </div>

         <div className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-[#0D0D0D]">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           AI Usage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Commits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                     {teamMembers.map((member) => (
                        <tr
                           key={member.id}
                           className="hover:bg-gray-50 dark:hover:bg-[#0D0D0D]"
                        >
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                 <span className="text-2xl">
                                    {member.avatar}
                                 </span>
                                 <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                       {member.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                       {member.email}
                                    </div>
                                 </div>
                                 <div
                                    className={`w-2 h-2 rounded-full ${
                                       member.status === "online"
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                    }`}
                                 />
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    member.role === "Admin"
                                       ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                       : member.role === "Developer"
                                       ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                       : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                 }`}
                              >
                                 {member.role === "Admin" && (
                                    <Crown className="w-3 h-3 mr-1" />
                                 )}
                                 {member.role === "Developer" && (
                                    <Code className="w-3 h-3 mr-1" />
                                 )}
                                 {member.role === "Viewer" && (
                                    <Eye className="w-3 h-3 mr-1" />
                                 )}
                                 {member.role}
                              </span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {member.aiUsage}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {member.commits}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {member.lastActive}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-[#6C33FF] hover:text-[#5A2BD8] mr-3">
                                 <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                 Remove
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );

   const renderProjects = () => (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
               Team Projects
            </h3>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
               <Plus className="w-4 h-4" />
               <span>New Project</span>
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
               <div
                  key={project.id}
                  className="bg-white dark:bg-[#161B22] border border-gray-200 dark:border-gray-700 rounded-xl p-6"
               >
                  <div className="flex items-start justify-between mb-4">
                     <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                           {project.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                           {project.description}
                        </p>
                     </div>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {project.status}
                     </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                     <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                           <Users className="w-4 h-4" />
                           <span>{project.members} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                           <GitBranch className="w-4 h-4" />
                           <span>{project.commits} commits</span>
                        </div>
                     </div>
                     <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.lastUpdate}</span>
                     </div>
                  </div>

                  <button
                     onClick={() => onSwitchView("ide")}
                     className="w-full bg-gray-100 dark:bg-[#0D0D0D] hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
                  >
                     Open in IDE
                  </button>
               </div>
            ))}
         </div>
      </div>
   );

   return (
      <div className="flex-1 bg-gray-50 dark:bg-[#0D0D0D] overflow-hidden">
         <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white dark:bg-[#161B22] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Team Dashboard
                     </h1>
                     <p className="text-gray-600 dark:text-gray-400">
                        Manage your development team
                     </p>
                  </div>
                  <div className="flex items-center space-x-3">
                     <button
                        onClick={() => onSwitchView("ide")}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-[#0D0D0D] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                     >
                        <Code className="w-4 h-4" />
                        <span>Switch to IDE</span>
                     </button>
                     <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <Settings className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-[#161B22] border-b border-gray-200 dark:border-gray-700 px-6">
               <nav className="flex space-x-8">
                  {[
                     { id: "overview", label: "Overview", icon: BarChart3 },
                     { id: "members", label: "Members", icon: Users },
                     { id: "projects", label: "Projects", icon: Code },
                  ].map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                           activeTab === tab.id
                              ? "border-[#6C33FF] text-[#6C33FF]"
                              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                     >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                     </button>
                  ))}
               </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
               {activeTab === "overview" && renderOverview()}
               {activeTab === "members" && renderMembers()}
               {activeTab === "projects" && renderProjects()}
            </div>
         </div>

         {/* Invite Modal */}
         {showInviteModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
               <div className="bg-white dark:bg-[#161B22] rounded-2xl shadow-2xl max-w-md w-full">
                  <div className="p-6">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                           Invite Team Member
                        </h3>
                        <button
                           onClick={() => setShowInviteModal(false)}
                           className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address
                           </label>
                           <input
                              type="email"
                              placeholder="colleague@example.com"
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Role
                           </label>
                           <select className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0D0D0D] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C33FF] focus:border-transparent">
                              <option value="developer">Developer</option>
                              <option value="admin">Admin</option>
                              <option value="viewer">Viewer</option>
                           </select>
                        </div>

                        <div className="flex space-x-3 pt-4">
                           <button
                              onClick={() => setShowInviteModal(false)}
                              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                           >
                              Cancel
                           </button>
                           <button className="flex-1 bg-gradient-to-r from-[#6C33FF] to-[#00A676] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all">
                              Send Invite
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default TeamDashboard;
