// Shared Tailwind CSS classes for consistent styling across components

export const sharedStyles = {
  // Container styles
  card: "bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl shadow-lg border border-white border-opacity-20",
  cardPadding: "p-6",
  cardCompact: "p-4",
  
  // Section styles
  section: "mt-6",
  sectionContent: "space-y-6",
  
  // Button styles
  buttonPrimary: "w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-pink-400 disabled:to-purple-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg border border-white border-opacity-20",
  buttonSecondary: "w-full bg-white bg-opacity-25 hover:bg-opacity-35 active:bg-opacity-40 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md border border-white border-opacity-30",
  buttonTertiary: "w-full bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-35 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md border border-white border-opacity-20",
  
  // Text styles
  title: "text-2xl sm:text-3xl font-bold text-center tracking-wide",
  subtitle: "text-center text-sm opacity-90 mt-1",
  sectionTitle: "text-lg font-bold mb-4 text-center text-white",
  sectionTitleCompact: "text-base font-bold mb-4 flex items-center gap-2",
  
  // Layout styles
  container: "max-w-md mx-auto px-4",
  fullScreen: "fixed inset-0 z-40 flex flex-col items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm",
  
  // Animation styles
  fadeIn: "animate-fade-in",
  
  // Color chip styles
  colorChip: "border-2 border-white shadow-lg rounded-lg transition-transform duration-200 group-hover:scale-110 cursor-pointer",
  colorChipLarge: "w-20 h-20 rounded-lg border-4 border-white shadow-xl",
  
  // Grid styles
  swatchGrid: "flex gap-2 justify-center flex-wrap",
  profileGrid: "grid grid-cols-2 gap-4",
  
  // Overlay styles
  overlay: "absolute inset-0 pointer-events-none",
  
  // Header styles
  header: "sticky top-0 z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20",
  headerContent: "max-w-md mx-auto px-4 py-6",
  
  // Special backgrounds
  gradientCard: "bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 border border-white border-opacity-30",
  featuredCard: "bg-gradient-to-r from-white from-10% to-white to-90% bg-opacity-20 rounded-xl p-6 border border-white border-opacity-30 text-center",
  
  // Image styles
  imageContainer: "relative overflow-hidden rounded-xl mb-4 shadow-lg",
  image: "w-full h-auto max-h-[70vh] object-cover",
  imageGradient: "absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-10"
} as const;

// Common component props for styling consistency
export interface BaseComponentProps {
  className?: string;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  compact?: boolean;
}

// Utility to merge custom classes with shared styles
export const mergeStyles = (baseStyle: string, customStyle?: string): string => {
  return customStyle ? `${baseStyle} ${customStyle}` : baseStyle;
};
