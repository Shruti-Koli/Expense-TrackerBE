  //decoding jwt token 
const token = localStorage.getItem('token');

function parseJwt (token) {
var base64Url = token.split('.')[1];
var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

return JSON.parse(jsonPayload);
}


//after content is loaded
window.addEventListener("DOMContentLoaded",async ()=>{
    try{
      const token  = localStorage.getItem('token');
      const decodeToken = parseJwt(token);
      console.log(decodeToken);
      const ispremiumuser = decodeToken.ispremiumuser
      if(ispremiumuser){
        showPremiumUserContent();
      }

      const pageSize=3;
      const page =1
      getData(page,pageSize,token);
      

    }catch(err){
      showError(err);
      console.log(err)
    }
})        

//shows Pagination
async function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
  try{
      const token = localStorage.getItem('token');
      console.log("currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage",currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage)
      const selector = document.getElementById('pageSizeSelector');
      const pageSize=selector.value;

      const pagination = document.getElementById('pagination');
      pagination.innerHTML = ''
      if (currentPage!=1 && currentPage!=2){
          const btnx = document.createElement('button')
          btnx.innerHTML = '1'
          btnx.addEventListener('click',()=>getData(1,pageSize,token))
          pagination.appendChild(btnx);
          if(currentPage>3){
            const t1 = document.createElement('p')
            t1.innerHTML = ' . . '
            pagination.appendChild(t1);
          }
      }

      if(hasPreviousPage){
          const btn2 = document.createElement('button')
          btn2.innerHTML = previousPage
          btn2.addEventListener('click', ()=>getData(previousPage,pageSize,token))
          pagination.appendChild(btn2)
      }

      const btn1 = document.createElement('button')
      btn1.innerHTML = currentPage
      btn1.addEventListener('click',()=>getData(currentPage,pageSize,token))
      pagination.appendChild(btn1)
      

      if (hasNextPage){
          const btn3 = document.createElement('button')
          btn3.innerHTML = nextPage
          btn3.addEventListener('click',()=>getData(nextPage,pageSize,token))
          pagination.appendChild(btn3)

      }
      if (currentPage!=lastPage  && (currentPage!= parseInt(lastPage)-1) && lastPage>1 && hasNextPage==true){
        if(currentPage!= parseInt(lastPage)-2){
          const t2 = document.createElement('p')
          t2.innerHTML = ' . . '
          pagination.appendChild(t2);
        }
          const btnz = document.createElement('button')
          btnz.innerHTML = lastPage
          btnz.addEventListener('click',()=>getData(lastPage,pageSize,token))
          pagination.appendChild(btnz)

      }
      
  }
  catch(err){
      console.log(err)
  }
}

//changing the number of entries to display
function pageSelectorChanged(e){
  console.log(e.target.value)
  const token  = localStorage.getItem('token');
  const pageSize=e.target.value;
  const page =1;
  getData(page,pageSize,token);
}

//get data from backend
async function getData(page,pageSize,token){
  try{
    const listE = await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&pageSize=${pageSize}`,{headers:{"auth":token}});
    console.log('htmlget');
    console.log(listE.data.allExpenses);
    console.log(listE.data);

    const displist = document.getElementById('expenseList');
    displist.innerHTML = "";
    for(let i=0;i<listE.data.allExpenses.length;i++){
        showItemOnScreen(listE.data.allExpenses[i]);
    }
    showPagination(listE.data);
  }catch(err){
    console.log(err)
    showError(err);
  }
}

  //adding expense to backend
async function addExpense(event){
    try{
        event.preventDefault();
        const token = localStorage.getItem('token');

        const price = event.target.price.value;
        const descr = event.target.descr.value;
        const category = event.target.category.value;
        const obj={
            price:price,
            descr:descr,
            category:category
        }
        const item = await axios.post("http://localhost:3000/expense/add-expense",obj,{headers:{"auth":token}})
        
        const selector = document.getElementById('pageSizeSelector');
        const pageSize=selector.value;
        const page =1
        getData(page,pageSize,token);
    }
    catch(err){
      console.log(err)
      showError(err);
    }
    event.target.price.value="";
    event.target.descr.value="";
    event.target.category.selectedIndex= 0;
} 

//showing items on screen
function showItemOnScreen(obj){
      const displist = document.getElementById('expenseList');
      displist.innerHTML = displist.innerHTML +`<tr id='${obj.id}'>
          <td>${obj.price}</td>
          <td>${obj.descr}</td>
          <td>${obj.category}</td>
          <td><button onclick="deleteExpense('${obj.id}','${obj.descr}','${obj.category}','${obj.price}')">Delete</button></td></tr>`
}

 //delete items from screen
async function deleteExpense(id,descr,category,price){
    try{
        const token = localStorage.getItem('token');
        console.log(id);
        let res= await axios.delete("http://localhost:3000/expense/delete-expense/"+id,{headers:{"auth":token}});
        console.log('deletedfrom be')
        const selector = document.getElementById('pageSizeSelector');
        const pageSize=selector.value;
        const page =1
        getData(page,pageSize,token);
      }catch(err){
      console.log(err)
      showError(err)
      }
}

 //show error box
function showError(err){
  if(err.response==undefined){
          const content = document.getElementById('content');
          content.innerHTML=`<div class="error_box-container"><div class="error_box">${err}</div></div>`+ content.innerHTML;
        }else{
          
          content.innerHTML=`<div class="error_box-container"><div class="error_box">${err.response.data.message}</div></div>`+ content.innerHTML;
        }
        const errbox= document.getElementsByClassName('error_box');
        for(let i=0;i<errbox.length;i++){
          setTimeout(()=>{
            errbox[i].style.display ='none';},3000);
        }
}

  //add premium features
document.getElementById('premium').onclick = async function (e) {
  const token = localStorage.getItem('token')
  const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"auth" : token} });
  console.log(response);
  var options ={
    "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
    "order_id": response.data.order.id,// For one time payment
    // This handler function will handle the success payment
    "handler": async function (response) {
        const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, { headers: {"auth" : token} })
        
        console.log(res)
        alert('You are a Premium User Now')
        showPremiumUserContent()
        localStorage.setItem('token', res.data.token)
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', async function (response){
    console.log(response);
    await axios.post('http://localhost:3000/purchase/updateTransactionFailedStatus',{
            order_id: options.order_id},{ headers: {"auth" : token} })
    alert('Something went wrong')
  });
}

function showPremiumUserContent(){
  document.getElementById('premium').style.display = "none";
  document.getElementById('paid').style.display = "inline-block";
  //showLeaderboard()
}


function leaderBoard(event){
  try{
    const token  = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
      window.location.href=`./leaderBoard/leaderBoard.html`
    }else{
      alert('! Buy premium to unlock this feature')
    }
  }catch(err){
    console.log(err)
    showError(err)
  }
}


function showReports(event){
  try{
    const token  = localStorage.getItem('token');
    const decodeToken = parseJwt(token)
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
      window.location.href=`./reports/reports.html`
    }else{
      alert('! Buy premium to unlock this feature')
    }
  }catch(err){
    console.log(err)
    showError(err)
  }
}
