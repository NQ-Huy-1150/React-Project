import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../../shared/ui/Homepage/HomepageLayout'
import Hello from '../../shared/ui/Welcome/hello'
import AppCaseConverter from '../caseConverter/ui/CaseConverter'
import AppLetterCounter from '../letterCounter/letterCounter'
import AppRentCalculator from '../rentCalculator/ui/RenCalculator'
import AppSpendTracker from '../spendTracker/ui/SpendTracker'
import AppNotes from '../notes/ui/Notes'
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            //hello page
            {
                index: true,
                element: <Hello />
            },
            {
                path: 'case-converter',
                element: <AppCaseConverter />
            },
            {
                path: 'rent-calculator',
                element: <AppRentCalculator />
            },
            {
                path: 'letter-counter',
                element: <AppLetterCounter />
            },
            {
                path: 'spend-tracker',
                element: <AppSpendTracker />
            },
            {
                path: 'notes',
                element: <AppNotes />
            }
        ]
    }
])
export default router;