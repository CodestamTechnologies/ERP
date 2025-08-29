import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { GripVertical, Settings, Eye, Plus, Minus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SidebarCustomizerProps {
  availableTools: any[]; installedTools: string[]; sidebarConfig: any;
  onInstall: (toolId: string) => void; onUninstall: (toolId: string) => void;
  onConfigUpdate: (config: any) => void; isProcessing: boolean;
}

export const SidebarCustomizer = ({
  availableTools, installedTools, sidebarConfig, onInstall, onUninstall, onConfigUpdate, isProcessing
}: SidebarCustomizerProps) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sidebarConfig.toolOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onConfigUpdate({ toolOrder: items });
  };

  const toggleTool = (toolId: string, enabled: boolean) => {
    const newEnabledTools = enabled 
      ? [...sidebarConfig.enabledTools, toolId]
      : sidebarConfig.enabledTools.filter((id: string) => id !== toolId);
    
    onConfigUpdate({ enabledTools: newEnabledTools });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Available Tools */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-2">
            <Settings size={20} className="text-blue-600" />
            <span>Available Tools</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {availableTools.map((tool, index) => (
            <motion.div key={tool.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-600">{tool.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{tool.name}</h4>
                    <p className="text-xs text-gray-500 truncate max-w-48">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {installedTools.includes(tool.id) ? (
                    <>
                      <Switch 
                        checked={sidebarConfig.enabledTools.includes(tool.id)}
                        onCheckedChange={(checked) => toggleTool(tool.id, checked)}
                        disabled={isProcessing}
                      />
                      <Button variant="outline" size="sm" onClick={() => onUninstall(tool.id)} disabled={isProcessing}>
                        <Minus size={12} />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => onInstall(tool.id)} disabled={isProcessing}>
                      <Plus size={12} className="mr-1" />Install
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Sidebar Preview */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center space-x-2">
            <Eye size={20} className="text-green-600" />
            <span>Sidebar Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-gray-900 rounded-lg p-4 min-h-96">
            <div className="text-white text-sm font-medium mb-4">Navigation Menu</div>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sidebar-tools">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {sidebarConfig.toolOrder
                      .filter((toolId: string) => sidebarConfig.enabledTools.includes(toolId))
                      .map((toolId: string, index: number) => {
                        const tool = availableTools.find(t => t.id === toolId);
                        if (!tool) return null;
                        
                        return (
                          <Draggable key={toolId} draggableId={toolId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                  snapshot.isDragging ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                              >
                                <div {...provided.dragHandleProps}>
                                  <GripVertical size={16} className="text-gray-400" />
                                </div>
                                <div className="text-lg">{tool.icon}</div>
                                <span className="text-white text-sm font-medium">{tool.name}</span>
                                <Badge variant="outline" className="ml-auto text-xs text-gray-300 border-gray-600">
                                  {tool.category}
                                </Badge>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            
            {sidebarConfig.enabledTools.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Settings size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tools enabled</p>
                <p className="text-xs">Enable tools to see them here</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Drag and drop to reorder • Toggle switches to enable/disable
          </div>
        </CardContent>
      </Card>
    </div>
  );
};