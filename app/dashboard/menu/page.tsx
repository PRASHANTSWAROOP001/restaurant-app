import MenuManagementPage from "@/components/menu/MenuPage"
import { getCategories , getMenuItems} from "@/app/action/MenuActions"

export default async function MenuServerPage(){

  const categoriesData = await getCategories()
  const initialMenuItemData = await getMenuItems({page:1, limit:10,search:""})


  return (

    <main className="w-full h-screen">

      <MenuManagementPage categoryData={categoriesData.data || []} initialData={initialMenuItemData.data||[]}></MenuManagementPage>

    </main>

  )
}