import { useState, useCallback } from 'react';

import { CONFIG } from 'src/config-global';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';

import { FoodForm } from 'src/sections/foods/food-form';

// ----------------------------------------------------------------------

export default function NewFoodPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (data: any, imageFile?: File) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your API
      console.log('Submitting food data:', data);
      console.log('Image file:', imageFile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to foods list
      router.push('/dashboard/foods');
    } catch (error) {
      console.error('Error creating food:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      <title>{`New Food - ${CONFIG.appName}`}</title>

      <DashboardContent>
        <Breadcrumb 
          title="New Food" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Foods', href: '/dashboard/foods' },
            { title: 'New Food' }
          ]} 
        />

        <FoodForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Create Food"
        />
      </DashboardContent>
    </>
  );
}
