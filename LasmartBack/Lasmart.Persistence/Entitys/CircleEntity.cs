
namespace Lasmark.Persistence.Entitys;

public class CircleEntity
{
    public int? Id { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public int Radius { get; set; }
    public string Color { get; set; }
    public List<CommentEntity>? Comments { get; set; }
}
