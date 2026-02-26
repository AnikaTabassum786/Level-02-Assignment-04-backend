type IOptions = {
    page?: number | string;
    limit?: number | string;

}

type IOptionsResult={
    page:number,
    limit:number,
    skip:number,
}

const paginationHelper=(options:IOptions):IOptionsResult=>{
    
  const page:number = Number(options.page) || 1
  const limit:number =Number(options.limit) || 10
  const skip = (page - 1) * limit

   return {
    page,
    limit,
    skip
   }
}

export default paginationHelper;