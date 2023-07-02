import ShopByCategoryListItems from '../components/ShopByCategoryListItem';
import FaceItem from '../components/FaceItem'
import BodyItem from '../components/BodyItem'



export default function Dropdown() {
  return (
    <section>
    <ul>
    <li>shop all</li>
    <li>shop by category</li>
    <ShopByCategoryListItems/>
    <li>summer care</li>
    <li>face</li>
    <FaceItem/>
    <li>body</li>
    <BodyItem/>
    </ul>
      
    </section>
  )
}
