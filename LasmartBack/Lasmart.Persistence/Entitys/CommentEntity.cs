


namespace Lasmark.Persistence.Entitys;

public class CommentEntity
{
    public int? Id { get; set; }
    public string Comment { get; set; }
    public string ColorBackground { get; set; }
    public int CircleId { get; set; }
    public CircleEntity? Circles { get; set; }
}
