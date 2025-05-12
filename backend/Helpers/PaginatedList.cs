namespace backend.Helpers;

public class PaginatedList<T>
{
    public List<T> Items { get; }
    public int PageIndex { get; }
    public int TotalPages { get; }
    public int TotalItems { get; }
    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < TotalPages;

    public PaginatedList(List<T> items, int pageIndex, int totalPages, int totalItems)
    {
        Items = items;
        PageIndex = pageIndex;
        TotalPages = totalPages;
        TotalItems = totalItems;
    }
    
    public bool IsOutOfBounds()
    {
        if (PageIndex == 1) 
        {
            // Specifically in this case, we don't want to return out of range
            // Because if there is no data we still want to return an empty list on the first page
            return false;
        }
        
        return PageIndex > TotalPages;
    }
    
    public PaginatedList<U> Convert<U>(Func<T, U> converter)
    {
        // Apply the converter function to each item
        var convertedItems = Items.Select(converter).ToList();

        // Create a new PaginatedList<U> using the converted items
        return new PaginatedList<U>(convertedItems, PageIndex, TotalPages, TotalItems);
    }
    
    public static PaginatedList<T> Of(IEnumerable<T> items, int pageIndex, int pageSize)
    {
        List<T> itemsList = items.ToList();
        int count = itemsList.Count;
        int totalPages = (int) Math.Ceiling(count / (double) pageSize);
        List<T> itemsPage = itemsList
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        return new PaginatedList<T>(itemsPage, pageIndex, totalPages, count);
    }
}