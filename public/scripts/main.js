/*ЗАГРУЗКА СТРАНИЦЫ*/
var recodsList;
var colors = [];
var selDiv;
var storedFiles = [];

document.addEventListener('DOMContentLoaded', function() {
	recodsList = document.getElementById('records-list');
	document.getElementById('files').addEventListener('change', handleFileSelect);
	selDiv = document.getElementById('selectedFiles');
	document.getElementById('myForm').addEventListener('submit', handleForm);
	document.getElementById('color-bar').addEventListener('change', filterRecords);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/list', true);

	xhr.onload = function() {

		if(this.status === 200) {
			var mainArray = JSON.parse(this.responseText);

			mainArray.forEach(function(value, index){
				addNewRecord(mainArray[index]);
			});
		}

	}

	xhr.send();


	/*УДАЛЕНИЕ ЗАПИСИ*/	
	var classname = document.getElementsByClassName('del');

	var i;
	for ( i = 0; i < classname.length; i++) {

		classname[i].addEventListener('click', function (event) {
			event.preventDefault();
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/del', true);

			xhr.onload = function() {

				if(this.status === 200) {
					document.getElementById('record-'+event.target.dataset.item).remove();
				}

			}

			xhr.send(this.dataset.item);
		});

	}
	
});

/*ФУНКЦИЯ ПОЛУЧЕНИЯ ИКОНКИ ОТ ТИПА ФАЙЛА*/
function getIcon(filename){
	switch (filename.split(".").pop().toUpperCase()){
		case "jpg".toUpperCase(): 
			return 'fa-file-image-o' 
			break; 
		case "jpeg".toUpperCase(): 
			return 'fa-file-image-o' 
			break;
		case "png".toUpperCase(): 
			return 'fa-file-image-o' 
			break; 	
		case "bmp".toUpperCase(): 
			return 'fa-file-image-o' 
			break; 
		case "tif".toUpperCase(): 
			return 'fa-file-image-o' 
			break; 
		case "txt".toUpperCase(): 
			return 'fa-file-text-o' 
			break; 
		case "doc".toUpperCase(): 
			return 'fa-file-word-o' 
			break; 
		case "docx".toUpperCase(): 
			return 'fa-file-word-o' 
			break; 	
		case "xls".toUpperCase(): 
			return 'fa-file-excel-o' 
			break; 
		case "xlsx".toUpperCase(): 
			return 'fa-file-excel-o' 
			break; 
		case "pdf".toUpperCase(): 
			return 'fa-file-pdf-o' 
			break; 
		case "zip".toUpperCase(): 
			return 'fa-file-archive-o' 
			break; 
		case "rar".toUpperCase(): 
			return 'fa-file-archive-o' 
			break; 
		case "7z".toUpperCase(): 
			return 'fa-file-archive-o' 
			break; 
		case "mp3".toUpperCase(): 
			return 'fa-file-audio-o' 
			break; 
		case "mp4".toUpperCase(): 
			return 'fa-file-video-o' 
			break; 
		case "wma".toUpperCase(): 
			return 'fa-file-video-o' 
			break; 	
		default: 
			return 'fa-file';
			break;
	}
}
/*ФУНЦИЯ ДОБАВЛЕНИЯ ЦВЕТА*/
function addColor(color){

	if (colors.indexOf(color) === -1) {
		colors.push(color);
		var option = document.createElement('option');
		option.style.backgroundColor = color;
		option.value = color;
		option.setAttribute('id', 'color-'+color);
		document.getElementById('color-bar').appendChild(option);
	}
}
/*ФУНЦИЯ ДОБАВЛЕНИЯ ЦВЕТА*/
function delColor(color){
	var classname = document.getElementsByClassName('record');	

	var haveSameColor = 0;
	for ( i = 0; i < classname.length; i++) {

		if (classname[i].dataset.color === color){
			haveSameColor = 1;
			break;
		}

	}

	if (haveSameColor === 0)	{
		colors.splice(colors.indexOf(color), 1);
		document.getElementById('color-'+color).remove();
	}
}
/*ФИЛЬТРАЦИЯ ПО ЦВЕТУ*/
function filterRecords(){
	var selectedColor = this.options[this.selectedIndex].value;
	var classname = document.getElementsByClassName('record');
	var i;

	if (selectedColor.toUpperCase() === 'none'.toUpperCase()){
		
		for ( i = 0; i < classname.length; i++) {
			classname[i].style.display = 'block';	
			this.style.backgroundColor = '';
		}

	}

	else{

		this.style.backgroundColor = selectedColor;
		
		for ( i = 0; i < classname.length; i++) {
			
			if (classname[i].dataset.color !== selectedColor){
				classname[i].style.display = 'none';
			}
			else{
				classname[i].style.display = 'block';
			}

		}	

	}
}
/*ФУНКЦИЯ ДОБАВЛЕНИЯ НОВОЙ ЗАПИСИ (элементов DOM)*/
function addNewRecord(object){
	var li = document.createElement('li');
	li.setAttribute('id', 'record-'+object.id);
	li.style.backgroundColor = object.color;
	li.dataset.color = object.color;
	li.classList.add('record');
	addColor(object.color);
	recodsList.appendChild(li);
	var span = document.createElement('span');
	span.innerHTML = object.recordname;
	li.appendChild(span);

	if (object.idsarray[0] !== undefined){

		if ((object.idsarray[0].filename !== null) && (object.idsarray[0].filedirect !== null)){
			var ul = document.createElement('ul');
			li.appendChild(ul);

			object.idsarray.forEach(function(value, index){
				var fileli = document.createElement('li');
				var i = document.createElement('i');
				i.classList.add(getIcon(object.idsarray[index].filename));
				var a = document.createElement('a');
				a.setAttribute('href', object.idsarray[index].filedirect);
				a.innerHTML = object.idsarray[index].filename;
				fileli.appendChild(i);
				fileli.appendChild(a);
				ul.appendChild(fileli);
			});		
		}

	}	

	var button = document.createElement('button');
	button.dataset.item = object.id;
	button.classList.add('del');
	button.innerHTML = 'X';
	li.appendChild(button);

	button.addEventListener('click', function (event) {
		event.preventDefault();
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/del', true);

		xhr.onload = function() {
		  	
		  	if(this.status === 200) {
		  		var record = document.getElementById('record-'+event.target.dataset.item)
		  		var color = record.dataset.color;
				record.remove();
				delColor(color);
			}

		}

		xhr.send(this.dataset.item);
	});	

}
/*ДОБАВЛЕНИЕ ФАЙЛОВ В СПИСОК ЗАГРУЖАЕМЫХ ФАЙЛОВ*/
function handleFileSelect(event) {
	var files = event.target.files;
	var filesArr = Array.prototype.slice.call(files);

	filesArr.forEach(function(element) { 

		if (storedFiles.length < 3)
		{
			storedFiles.push(element);

			var reader = new FileReader();

			reader.onload = function (event) {
				var li = document.createElement('li');
				li.classList.add("addedfile");
				var i = document.createElement('i');
				i.classList.add(getIcon(element.name));
				var span = document.createElement('span');
				span.innerHTML= element.name;
				var button = document.createElement('button');
				button.innerHTML = 'X';
				button.classList.add('selFile');
				button.dataset.file = element.name;
				li.appendChild(i);
				li.appendChild(span);
				li.appendChild(button);
				button.addEventListener('click', removeFile);
				selDiv.appendChild(li);
			}

			reader.readAsDataURL(element); 
		}

	});  
}
/*ОТПРАВКА ФОРМЫ*/   
function handleForm(event) {

	event.preventDefault();
	var data = new FormData();
	var textItem = document.getElementById('text');
	var colorItem = document.getElementById('color');

	for(var i = 0, len = storedFiles.length; i < len; i++) {
		data.append('files', storedFiles[i]); 
	}

	data.append('text', textItem.value + ';' + colorItem.value); 
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/', true);

	xhr.onload = function() {

		if(this.status == 200) {
			var obj = JSON.parse(this.responseText);
			addNewRecord(obj);
		}

	}

	xhr.send(data);
	document.getElementById('text').value=''; 
	document.getElementById('files').value='';
	storedFiles = [];
	var addedfiles=document.getElementsByClassName('addedfile');
	
	var i;
	for (i = addedfiles.length; i > 0; i--) {
		addedfiles[i-1].parentNode.removeChild(addedfiles[i-1]);
	}
}
/*УДАЛЕНИЕ ЭЛЕМЕНТА ИЗ СПИСКА ЗАГРУЖЕМЫХ ФАЙЛОВ*/
function removeFile(event) {
	var file = this.dataset.file;

	for(var i = 0; i < storedFiles.length; i++) {
		
		if(storedFiles[i].name === file) {
			storedFiles.splice(i,1);
			break;
		}

	}

	this.parentNode.remove();
}