
import { getCategories , getMenuItems} from "@/app/action/MenuActions"
import MenuMainClientPage from "@/components/menu/MenuMainPage"


export default async function MenuServerPage(){

  const categoriesData = await getCategories()
  const initialMenuItemData = await getMenuItems({page:1, limit:5,search:""})


  return (

    <main className="w-full h-screen">
        <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-gray-600 mt-2">Manage your restaurant menu items, prices, and categories</p>
      </div>
      <MenuMainClientPage intialPages={initialMenuItemData.totalPage || 1} intialData={initialMenuItemData.data || []} categoryDto={categoriesData.data || []}></MenuMainClientPage>
    </main>

  )
}