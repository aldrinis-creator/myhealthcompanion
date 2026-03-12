import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Utensils, Apple, Coffee, ChefHat, Sparkles, ChevronRight, Info, Heart, Globe, Camera, Activity, Thermometer, Pencil } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { motion } from "framer-motion";

const NutritionAdvisor = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'meal-plan',
      title: 'Suggest a Meal Plan',
      description: 'Personalized for this time of day',
      icon: <Utensils className="w-10 h-10 text-blue-600" />,
      color: 'bg-blue-50'
    },
    {
      id: 'analyze',
      title: 'Analyze This Meal',
      description: 'Photo scan for calories & nutrients',
      icon: <Camera className="w-10 h-10 text-blue-600" />,
      color: 'bg-white border-2 border-slate-100'
    },
    {
      id: 'recovery',
      title: 'Post-Workout Recovery',
      description: 'Recovery meal based on your activity',
      icon: <Activity className="w-10 h-10 text-blue-600" />,
      color: 'bg-white border-2 border-slate-100'
    },
    {
      id: 'feeling-unwell',
      title: 'I\'m Not Feeling Well',
      description: 'Gentle meal plan for recovery',
      icon: <Thermometer className="w-10 h-10 text-blue-600" />,
      color: 'bg-white border-2 border-slate-100'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <AppHeader title="Nutrition Advisor" showBack showTabs={false} />

      <main className="max-w-lg mx-auto p-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1E293B]">Nutrition Advisor</h1>
            <p className="text-slate-500 mt-1">AI-powered meal guidance tailored to you</p>
          </div>
          <button className="bg-white border-2 border-slate-100 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Pencil className="w-4 h-4" />
            Edit Persona
          </button>
        </div>

        <div className="space-y-4">
          {options.map((opt) => (
            <div 
              key={opt.id}
              className={`${opt.color} rounded-[2rem] p-8 flex flex-col items-center text-center cursor-pointer hover:scale-[1.02] transition-all shadow-sm group`}
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <h3 className="text-xl font-black text-[#1E293B] mb-1">{opt.title}</h3>
              <p className="text-slate-500 font-medium">{opt.description}</p>
            </div>
          ))}
        </div>

      </main>
      <AppFooter />
    </div>
  );
};

export default NutritionAdvisor;
