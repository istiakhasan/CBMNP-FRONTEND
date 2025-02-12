"use client"
import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation'; // Import from next/navigation
import React from 'react';

const LocalSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname
    const a=pathname?.split('/').splice(0,1)
    console.log(a,"adsfsa");
    console.log(pathname?.split('/').slice(2).join('/'),"pathname");
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        router.replace(`/${newLocale}/${pathname?.split('/').slice(2).join('/')}`);
    };
    return (
        <div>
            <select defaultValue={locale} name="language" onChange={handleLanguageChange}>
                {
                    routing?.locales?.map((item: string, i: number) => (
                        <option key={i} value={item}>{item}</option>
                    ))
                }
            </select>
        </div>
    );
};

export default LocalSwitcher;