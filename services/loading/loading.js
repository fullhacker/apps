export class LoadingService {
    addLoading(element) {
        element.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
    }
}