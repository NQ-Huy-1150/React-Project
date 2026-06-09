import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../../shared/ui/Homepage/HomepageLayout'
import Hello from '../../shared/ui/Welcome/hello'
import AppCaseConverter from '../caseConverter/ui/CaseConverter'
import AppLetterCounter from '../letterCounter/ui/letterCounter'
import AppRentCalculator from '../rentCalculator/ui/RenCalculator'
import AppSpendTracker from '../spendTracker/ui/SpendTracker'
import AppNotes from '../notes/ui/Notes'
import NotePad from '../notes/ui/Notepad'
import NoteTodolist from '../notes/ui/Todolist'
import NoteCatalog from '../notes/ui/Catalog'
import NoteArchive from '../notes/ui/Archive'
import { TodoListAction, GetAllTodoList } from '../notes/api/TodoListApi'
import { GetAllNotePad, NotePadAction } from '../notes/api/NotePadApi'
import { NotesCatalogLoader } from '../notes/api/CatalogApi'
import { GetAllHousingExpenses, HousingExpenseAction } from '../rentCalculator/api/HousingExpenseApi'
import { GetAllPersionalExpenses, PersionalExpensesAction } from '../spendTracker/api/PersionalExpensesApi'

const noteRoutes = {
    path: 'notes', element: <AppNotes />,
    children: [
        { index: true, element: <NoteCatalog />, loader: NotesCatalogLoader },
        { path: 'take-note', element: <NotePad />, action: NotePadAction, loader: GetAllNotePad },
        { path: 'todo-list', element: <NoteTodolist />, action: TodoListAction, loader: GetAllTodoList },
        { path: 'catalog', element: <NoteCatalog />, loader: NotesCatalogLoader },
        { path: 'archive', element: <NoteArchive /> }
    ]
};
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Hello /> },
            { path: 'case-converter', element: <AppCaseConverter /> },
            {
                path: 'rent-calculator',
                element: <AppRentCalculator />,
                loader: GetAllHousingExpenses,
                action: HousingExpenseAction
            },
            { path: 'letter-counter', element: <AppLetterCounter /> },
            {
                path: 'spend-tracker',
                element: <AppSpendTracker />,
                loader: GetAllPersionalExpenses,
                action: PersionalExpensesAction
            },
            noteRoutes
        ]
    }
])
export default router;
