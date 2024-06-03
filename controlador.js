// Controlador AngularJS
var app = angular.module("MiAngularApp", []);

app.controller("controllerLibro", function ($scope, $http, $timeout) {
    // Lista de libros
    $scope.listBook = [];
    // Variable para almacenar la consulta de búsqueda
    $scope.searchQuery = '';
    
    // Cargar datos desde el archivo JSON
    $http.get('libros.json').then(function(response) {
        $scope.listBook = response.data;
    });

    // Nuevo libro a agregar
    $scope.newBook = {};
    // Modo de edición
    $scope.editMode = false;
    // Mensaje de alerta
    $scope.alertMessage = '';
    // Tipo de alerta
    $scope.alertType = '';

    // Función para verificar si el formulario es válido
    $scope.isFormValid = function() {
        return $scope.newBook.nombre_libro && $scope.newBook.resumen && $scope.newBook.image;
    };
    


    // Función para agregar un libro
    $scope.agregarLibro = function() {
        if ($scope.isFormValid()) {
            $scope.listBook.push(angular.copy($scope.newBook));
            $scope.newBook = {};
            // Mostrar alerta de éxito
            $scope.showAlert('Libro agregado exitosamente', 'success');
        }
    };

    // Función para verificar si se realizaron ediciones en el libro
    $scope.isEdited = function() {
        return !angular.equals($scope.newBook, $scope.originalBook);
    };

   // Variable para almacenar el índice del libro original
$scope.originalBookIndex = -1;

// Función para editar un libro
$scope.editarLibro = function(book) {
    // Obtener el índice del libro original
    $scope.originalBookIndex = $scope.listBook.indexOf(book);
    // Hacer una copia profunda del libro original
    $scope.originalBook = angular.copy(book);
    // Hacer una copia del libro para edición
    $scope.newBook = angular.copy(book);
    $scope.editMode = true;
    // Mostrar modal de edición
    $('#editarLibroModal').modal('show');
};

// Función para guardar los cambios editados en un libro
$scope.guardarCambios = function() {
    if ($scope.isEdited()) {
        if ($scope.originalBookIndex !== -1) {
            // Actualizar el libro en la lista con la copia modificada
            $scope.listBook[$scope.originalBookIndex] = angular.copy($scope.newBook);
            $scope.editMode = false;
            // Mostrar alerta de éxito
            $scope.showAlert('Cambios guardados exitosamente', 'info');
            $('#editarLibroModal').modal('hide');
        }
    }
};



    // Función para cancelar la edición de un libro
    $scope.cancelarEdicion = function() {
        $scope.newBook = {};
        $scope.editMode = false;
    };

    // Función para eliminar un libro
    $scope.eliminarLibro = function(book) {
        var index = $scope.listBook.indexOf(book);
        if(index !== -1) {
            $scope.listBook.splice(index, 1);
            // Mostrar alerta de éxito
            $scope.showAlert('Libro eliminado exitosamente', 'danger');
        }
    };

    // Función para mostrar la alerta
    $scope.showAlert = function(message, type) {
        $scope.alertMessage = message;
        $scope.alertType = 'alert-' + type;
        // Mostrar modal de alerta
        $('#alertModal').modal('show');
        // Ocultar la alerta después de 3 segundos
        $timeout(function() {
            $scope.alertMessage = '';
            // Ocultar modal de alerta después de ocultar la alerta
            $('#alertModal').modal('hide');
        }, 3000);
    };

    // Limpiar campos de edición al ocultar el modal de alerta
    $('#alertModal').on('hidden.bs.modal', function () {
        $scope.$apply(function () {
            $scope.newBook = {};
        });
    });

    // Función para filtrar libros basados en la consulta de búsqueda
    $scope.filtrarLibros = function(book) {
        if (!$scope.searchQuery) {
            return true; // Mostrar todos los libros si el campo de búsqueda está vacío
        } else {
            return book.nombre_libro.toLowerCase().includes($scope.searchQuery.toLowerCase());
        }
    };
});