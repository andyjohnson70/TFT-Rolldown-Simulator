import { RerollButton, XpButton } from "./components/buttons";
import { Shop } from "./components/shop";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="upper-section">
        <div className="options">
          
          </div>
        <div className="active-traits">

        </div>

        <div className="board">

        </div>

        <div className="bench">

        </div>
      </div>

      <div className="lower-section bg-slate-300 fixed bottom-0 h-44 w-8/12">
        <div className="dashboard h-1/5">
        
        </div>
  
        <div className="shop-container flex h-4/5 w-full">
          <div className="buttons flex flex-col bg-slate-700 w-1/5">
            <XpButton />
            <RerollButton />
          </div>
          <div className="shop bg-slate-800 w-4/5">
            <Shop></Shop>
          </div>
          
        </div>
      </div>
     
    </main>
  );
}
