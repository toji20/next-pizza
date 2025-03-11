import { Container, Title, TopBar, Filters, ProductsGroupList, Stories } from "@/components/shared";
import { findPizzas, GetSearchParams } from "@/lib/find-pizzas";
import { prisma } from "@/prisma/prisma-client";
import { Suspense } from "react";

export default async function Home({searchParams}: {searchParams: any}) {
  const categories = await findPizzas(searchParams as GetSearchParams);
  return <>
  
  <Container className="mt-10">
    <Title text="Все пиццы" size="lg" className="font-extrabold"/>
  </Container>
  
  <TopBar categories={categories.filter((category) => category.products.length > 0)}/>

  <Stories />

  {/* Фильтрация */}
  <Container className="mt-10 pb-14">
    <div className="flex gap-[80px]">
      <div className="w-[250px]">
        <Suspense>
        <Filters />
        </Suspense>
      </div>


      {/* Список товаров */}
      <div className="flex-1">
        
        <div className="flex flex-col gap-16">
          {
            categories.map((category) => (
              category.products.length > 0 && (
                <ProductsGroupList
                  title={category.name}
                  key={category.id}
                  categoryId={category.id}
                  items={category.products}
          />
              )
            ))
          }
        </div>
      </div>
    </div>
  </Container>
  </>
}
