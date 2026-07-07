import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CATEGORIES } from '../../constants';
import type { CategoryItem } from '../../constants';
import type { IssueCategory } from '../../types';
import { useLanguage } from '../language/LanguageContext';
import {
  FiAlertOctagon,
  FiTrash2,
  FiSun,
  FiDroplet,
  FiTruck,
  FiZap,
  FiMoreHorizontal,
} from 'react-icons/fi';

interface CategorySelectionProps {
  selectedCategory: IssueCategory | null;
  onSelectCategory: (category: IssueCategory) => void;
  onContinue: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onContinue,
}) => {
  const { t } = useLanguage();

  const iconMap = {
    road: <FiAlertOctagon className="w-6 h-6 text-brand-blue-700" />,
    garbage: <FiTrash2 className="w-6 h-6 text-brand-blue-700" />,
    light: <FiSun className="w-6 h-6 text-brand-blue-700" />,
    water: <FiDroplet className="w-6 h-6 text-brand-blue-700" />,
    transport: <FiTruck className="w-6 h-6 text-brand-blue-700" />,
    electricity: <FiZap className="w-6 h-6 text-brand-blue-700" />,
    other: <FiMoreHorizontal className="w-6 h-6 text-brand-blue-700" />,
  };

  const getCategoryDetails = (id: IssueCategory) => {
    switch (id) {
      case 'road_damage':
        return { label: t.road_damage, desc: t.road_damage_desc };
      case 'garbage':
        return { label: t.garbage, desc: t.garbage_desc };
      case 'street_light':
        return { label: t.street_light, desc: t.street_light_desc };
      case 'water_leakage':
        return { label: t.water_leakage, desc: t.water_leakage_desc };
      case 'public_transport':
        return { label: t.public_transport, desc: t.public_transport_desc };
      case 'electricity':
        return { label: t.electricity, desc: t.electricity_desc };
      case 'other':
      default:
        return { label: t.other, desc: t.other_desc };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20 } },
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto px-4 py-5 select-none text-left">
      {/* Intro Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-brand-blue-900 tracking-tight leading-tight">
          {t.selectCategoryTitle}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {t.selectCategoryDesc}
        </p>
      </div>

      {/* Grid of Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3.5"
      >
        {CATEGORIES.map((item: CategoryItem) => {
          const { label, desc } = getCategoryDetails(item.id);
          const isSelected = selectedCategory === item.id;

          return (
            <motion.div key={item.id} variants={itemVariants}>
              <Card
                selected={isSelected}
                interactive={true}
                onClick={() => onSelectCategory(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(item.id);
                  }
                }}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className="flex items-start gap-4 p-4 cursor-pointer"
              >
                {/* Icon Box */}
                <div className="p-3 bg-brand-blue-50 border border-brand-blue-100/50 rounded-xl flex-shrink-0">
                  {iconMap[item.iconType]}
                </div>
                
                {/* Details */}
                <div className="flex flex-col gap-0.5 text-left">
                  <h3 className="text-sm font-bold text-brand-blue-900 leading-tight">
                    {label}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Actions */}
      <div className="mt-4">
        <Button
          fullWidth={true}
          onClick={onContinue}
          disabled={!selectedCategory}
        >
          {t.continue}
        </Button>
      </div>
    </div>
  );
};
