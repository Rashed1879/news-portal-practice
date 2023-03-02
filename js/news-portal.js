let fetchData = [];

const fetchCategories = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
    .then(res => res.json())
    .then(data => showCategories(data.data));
};

const showCategories = data => {
    // capture Categories container to append all the category link
    const categoriesContainer = document.getElementById('categories-container');
    data.news_category.forEach(singleCategory =>{
       console.log(singleCategory);
       categoriesContainer.innerHTML += `<a class="nav-link" onclick="fetchCategoryNews('${singleCategory.category_id}','${singleCategory.category_name}')" href="#">${singleCategory.category_name}</a>`
    })
}

// fetch all news available in a category
const fetchCategoryNews = (category_id,category_name) => {
    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;
    fetch(url).then(res => res.json()).then(data => {
        fetchData = data.data;
        showAllNews(data.data,category_name)
    });
}

const showAllNews = (data,category_name) => {
    document.getElementById('all-news').innerHTML = '';
    // console.log(data,category_name);
    document.getElementById('news-count').innerText = data.length;
    document.getElementById('category-name').innerText = category_name;

    data.forEach(singleNews => {
        const {_id,image_url,title,details,author,total_view,rating} = singleNews;
        document.getElementById('all-news').innerHTML += `
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src=${image_url} class="img-fluid rounded-start" alt="..." />
            </div>
            <div class="col-md-8 d-flex flex-column">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">
                  ${details.slice(0,200)}...
                </p>
              </div>
              <div class="card-footer border-0 bg-body d-flex justify-content-between">
              <div class = "d-flex gap-2">
              <img src=${author.img} class="img-fluid rounded-circle" alt="..." height="40" width="40"/> 
              <div>
              <p class="p-0 m-0">${author.name ? author.name : "Not Available"}</p>
              <p class="p-0 m-0">${author.published_date}</p>
              </div>
              </div>
              <div class = "d-flex gap-1 align-items-center">
                <i class="fas fa-eye"></i>
                <p class="p-0 m-0">${total_view ? total_view : "not available"}</p>
              </div>
              <div class = "d-flex gap-2 align-items-center">
              ${generateStar(rating.number)}
              <p class="mt-3">${rating.number}</p>
              </div>
              <div>
              <i class="fas fa-arrow-right" onclick="fetchNewsDetail('${_id}')" data-bs-toggle="modal"
              data-bs-target="#exampleModal"></i>
              </div>
              </div>
            </div>
          </div>
        </div>
        `
    });
};

const fetchNewsDetail = news_id =>{
    let url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    fetch(url).then(res => res.json()).then(data => showNewsDetail(data.data[0]));

}

const showNewsDetail = newsDetail =>{
    document.getElementById('modal-body').innerHTML = "";
    const {_id,image_url,title,details,author,total_view,others_info,rating} = newsDetail;
    document.getElementById('modal-body').innerHTML += `
    <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-12">
              <img src=${image_url} class="img-fluid rounded-start" alt="..." />
            </div>
            <div class="col-md-12 d-flex flex-column">
              <div class="card-body">
                <h5 class="card-title">${title} <span class="badge text-bg-warning" id="badge">
                ${others_info.is_trending ? "Trending" : "Regular"}</span></h5>
                <p class="card-text">
                  ${details}
                </p>
              </div>
              <div class="card-footer border-0 bg-body d-flex justify-content-between">
              <div class = "d-flex gap-2">
              <img src=${author.img} class="img-fluid rounded-circle" alt="..." height="40" width="40"/> 
              <div>
              <p class="p-0 m-0">${author.name ? author.name : "Not Available"}</p>
              <p class="p-0 m-0">${author.published_date}</p>
              </div>
              </div>
              <div class = "d-flex gap-1 align-items-center">
                <i class="fas fa-eye"></i>
                <p class="p-0 m-0">${total_view ? total_view : "not available"}</p>
              </div>
              <div class="d-flex align-items-center">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half"></i>
              <p class="mt-3">${rating.number}</p>
              </div>
              </div>
            </div>
          </div>
        </div>
    `
};

const showTrending = () =>{
  const trendingNews = fetchData.filter(singleData => singleData.others_info.is_trending === true);
  const category_name = document.getElementById('category-name').innerText;
  const trending_category_name = "Trending"+' '+category_name;
  showAllNews(trendingNews,trending_category_name);
}
const showTodaysPick = () =>{
  const todaysPickNews = fetchData.filter(singleData => singleData.others_info.is_todays_pick
    === true);
    console.log(todaysPickNews);
  const category_name = document.getElementById('category-name').innerText;
  const todaysPick_category_name = "Todays Pick"+' '+category_name;
  showAllNews(todaysPickNews,todaysPick_category_name);
}

const generateStar = rating =>{
    let ratingHtml = "";
    for(let i = 0; i < Math.floor(rating); i++){
        ratingHtml += `<i class="fas fa-star"></i>`;
    }
    if(rating - Math.floor(rating)>0){
        ratingHtml += `<i class="fas fa-star-half"></i>`
    }
    return ratingHtml;
};