'use client';

import React from 'react';
import { BasicAlert } from './BasicAlert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { IoIosArrowDown } from 'react-icons/io';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4'>
          <BasicAlert
            variant='destructive'
            title='Something went wrong.'
            description='An unexpected error occurred. Please try again later.'
          />
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Collapsible className='w-full space-y-2 mt-4'>
              <CollapsibleTrigger asChild>
                <Button variant='outline' className='w-full justify-between'>
                  <span>Debug Info</span>
                  <IoIosArrowDown size={18} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className='space-y-2'>
                <div className='rounded-md border px-4 py-3 font-mono text-sm'>
                  <pre className='whitespace-pre-wrap'>{this.state.error.stack}</pre>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
