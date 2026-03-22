import { useState } from 'react';
import { Plus, Trash2, Edit2, Bot } from 'lucide-react';
import { BotTemplate } from '../lib/types';

interface BotManagementTabProps {
  botTemplates: BotTemplate[];
  addBotTemplate: (name: string, description: string, price: number, performance: number, winRate: number, trades: number, type: string, risk: 'Low' | 'Medium' | 'High', maxDrawdown: number) => void;
  editBotTemplate: (botId: string, updates: Partial<BotTemplate>) => void;
  deleteBotTemplate: (botId: string) => void;
}

export function BotManagementTabComponent({
  botTemplates,
  addBotTemplate,
  editBotTemplate,
  deleteBotTemplate
}: BotManagementTabProps) {
  const [editingBotId, setEditingBotId] = useState<string | null>(null);
  const [botForm, setBotForm] = useState({
    name: '',
    description: '',
    price: '',
    performance: '',
    winRate: '',
    trades: '',
    type: 'AI Trading',
    risk: 'Medium' as 'Low' | 'Medium' | 'High',
    maxDrawdown: ''
  });

  const updateFormField = (field: string, value: any) => {
    setBotForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteBot = async (botId: string) => {
    if (confirm('Are you sure you want to delete this bot template?')) {
      await deleteBotTemplate(botId);
    }
  };

  const handleAddBot = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (botForm.name && botForm.price && botForm.performance && botForm.winRate && botForm.trades && botForm.maxDrawdown) {
      if (editingBotId) {
        await editBotTemplate(editingBotId, {
          name: botForm.name,
          description: botForm.description,
          price: parseFloat(botForm.price),
          performance: parseFloat(botForm.performance),
          winRate: parseFloat(botForm.winRate),
          trades: parseFloat(botForm.trades),
          type: botForm.type,
          risk: botForm.risk,
          maxDrawdown: parseFloat(botForm.maxDrawdown)
        });
        setEditingBotId(null);
      } else {
        await addBotTemplate(
          botForm.name,
          botForm.description,
          parseFloat(botForm.price),
          parseFloat(botForm.performance),
          parseFloat(botForm.winRate),
          parseFloat(botForm.trades),
          botForm.type,
          botForm.risk,
          parseFloat(botForm.maxDrawdown)
        );
      }
      resetBotForm();
    }
  };

  const resetBotForm = () => {
    setBotForm({
      name: '',
      description: '',
      price: '',
      performance: '',
      winRate: '',
      trades: '',
      type: 'AI Trading',
      risk: 'Medium',
      maxDrawdown: ''
    });
    setEditingBotId(null);
  };

  const handleEditBot = (bot: BotTemplate) => {
    setBotForm({
      name: bot.name,
      description: bot.description,
      price: bot.price.toString(),
      performance: bot.performance.toString(),
      winRate: bot.winRate.toString(),
      trades: bot.trades.toString(),
      type: bot.type,
      risk: bot.risk,
      maxDrawdown: bot.maxDrawdown.toString()
    });
    setEditingBotId(bot.id);
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Bot Form */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {editingBotId ? 'Edit Bot Template' : 'Create New Bot Template'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Bot Name</label>
            <input
              type="text"
              placeholder="e.g., Scalper Pro V2"
              value={botForm.name}
              onChange={(e) => updateFormField('name', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Bot Type</label>
            <input
              type="text"
              placeholder="e.g., High Frequency, Swing Trading"
              value={botForm.type}
              onChange={(e) => updateFormField('type', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Price ($)</label>
            <input
              type="number"
              placeholder="149.99"
              step="0.01"
              value={botForm.price}
              onChange={(e) => updateFormField('price', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Risk Level</label>
            <select
              value={botForm.risk}
              onChange={(e) => updateFormField('risk', e.target.value)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors cursor-pointer"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Performance (%)</label>
            <input
              type="number"
              placeholder="45"
              value={botForm.performance}
              onChange={(e) => updateFormField('performance', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Win Rate (%)</label>
            <input
              type="number"
              placeholder="72"
              value={botForm.winRate}
              onChange={(e) => updateFormField('winRate', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Total Trades</label>
            <input
              type="number"
              placeholder="156"
              value={botForm.trades}
              onChange={(e) => updateFormField('trades', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#8b949e] uppercase mb-2 block">Max Drawdown (%)</label>
            <input
              type="number"
              placeholder="8"
              value={botForm.maxDrawdown}
              onChange={(e) => updateFormField('maxDrawdown', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBot(e as any)}
              className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#8b949e] uppercase mb-2 block">Description</label>
          <textarea
            placeholder="Detailed description of the bot strategy, features, and benefits..."
            value={botForm.description}
            onChange={(e) => updateFormField('description', e.target.value)}
            className="w-full px-4 py-2 bg-[#0d1117] border border-[#21262d] text-white rounded-lg focus:outline-none focus:border-[#2962ff] transition-colors h-20"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddBot}
            type="button"
            className="flex-1 py-2.5 bg-[#26a69a] hover:bg-teal-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {editingBotId ? 'Update Bot' : 'Create Bot'}
          </button>
          {editingBotId && (
            <button
              onClick={resetBotForm}
              type="button"
              className="px-6 py-2.5 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Bot Templates List */}
      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Bot Templates ({botTemplates.length})</h3>
        
        {botTemplates.length > 0 ? (
          <div className="space-y-3">
            {botTemplates.map((bot) => (
              <div key={bot.id} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-4 hover:border-[#26a69a] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">{bot.name}</h4>
                    <p className="text-sm text-[#8b949e] mt-1">{bot.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <span className="text-xs text-[#8b949e]">Price</span>
                        <p className="text-white font-bold">${bot.price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-[#8b949e]">Performance</span>
                        <p className="text-[#26a69a] font-bold">{bot.performance}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-[#8b949e]">Win Rate</span>
                        <p className="text-white font-bold">{bot.winRate}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-[#8b949e]">Risk</span>
                        <p className={`font-bold ${
                          bot.risk === 'Low' ? 'text-[#26a69a]' :
                          bot.risk === 'Medium' ? 'text-yellow-500' :
                          'text-[#ef5350]'
                        }`}>{bot.risk}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBot(bot)}
                      className="p-2 bg-[#2962ff]/20 text-[#2962ff] hover:bg-[#2962ff]/30 rounded-lg transition-colors"
                      title="Edit bot"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBot(bot.id)}
                      className="p-2 bg-[#ef5350]/20 text-[#ef5350] hover:bg-[#ef5350]/30 rounded-lg transition-colors"
                      title="Delete bot"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-[#21262d] rounded-lg">
            <Bot className="h-8 w-8 text-[#8b949e] mx-auto mb-2" />
            <p className="text-[#8b949e]">No bot templates created yet. Create one above to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
